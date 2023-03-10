const Product = require("../../models/Product");
const User = require("../../models/User");
const {
  Types: { ObjectId },
} = require("mongoose");

const convertImageToBase64 = (products) => {
  const convertedProducts = products.map((product) => {
    let buffer, base64Image;
    if (product.image) {
      buffer = Buffer.from(product.image);
      base64Image = buffer.toString("base64");
    }

    return { ...product._doc, image: base64Image || "" };
  });
  return convertedProducts;
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({ sold: false, forSale: true });

    const products = convertImageToBase64(allProducts);
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const getUserPurchasedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("purchasedProducts")
      .exec();

    const products = convertImageToBase64(user.purchasedProducts);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const getUserCartProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cartProducts")
      .exec();

    const products = convertImageToBase64(user.cartProducts);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const getUserCreatedProducts = async (req, res) => {
  try {
    const userCreatedProducts = await Product.find({ createdBy: req.user._id });

    const products = convertImageToBase64(userCreatedProducts);

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const createProduct = async (req, res) => {
  let {
    body: { name, price, forSale },
    file,
    user: { _id },
  } = req;

  try {
    if (name === "" || isNaN(price)) {
      return res.status(400).json({ message: "Enter valid data", error: true });
    }
    const id = _id.toString();

    const product = new Product({
      name,
      price,
      forSale,
      image: file.buffer || null,
      createdBy: id,
    });

    await product.save();

    let buffer, base64Image;
    if (product.image) {
      buffer = Buffer.from(product.image);
      base64Image = buffer.toString("base64");
    }

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product: { ...product._doc, image: base64Image || "" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const updateProduct = async (req, res) => {
  try {
    let {
      params: { id: productId },
      user: { _id: userId },
      body: { forSale },
    } = req;
    productId = productId.toString();
    userId = userId.toString();

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ message: "Product not Found!", error: true });
    }

    if (product.createdBy.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Invalid creator!", error: true });
    }

    product.forSale = forSale;

    await product.save();

    res.status(202).json({
      message: "Product updated successfully",
      success: true,
      product: { ...product._doc, forSale },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const buyProducts = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findById(userId).populate("cartProducts").exec();

    const unsoldProducts = user.cartProducts.filter(
      (prod) =>
        prod.sold === false &&
        prod.createdBy.toString() !== userId.toString() &&
        prod.forSale === true
    );

    if (unsoldProducts.length === 0) {
      return res.status(404).json({ message: "Cart is Empty!", error: true });
    }

    const products = convertImageToBase64(unsoldProducts);

    let idsArray = [];

    products.forEach((prod) => {
      idsArray.push(ObjectId(prod._id));
    });

    await Product.updateMany(
      { _id: { $in: idsArray } },
      { sold: true, forSale: false }
    );

    req.user.cartProducts = [];
    req.user.purchasedProducts = [...req.user.purchasedProducts, ...idsArray];
    await req.user.save();

    res.status(200).json({
      message: "Purchased products successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const addProductToCart = async (req, res) => {
  let {
    params: { id: productId },
    user,
  } = req;
  console.log(productId);
  try {
    productId.toString();
    const product = await Product.findById(productId);

    if (!product || product.sold || !product.forSale)
      return res
        .status(400)
        .json({ message: "Product not Found!", error: true });

    const { _id: userId } = req.user;

    if (product.createdBy.toString() === userId.toString()) {
      return res.status(404).json({
        message: `Cannot add ${product.name} created by you!`,
        error: true,
      });
    }

    const productInCart = user.cartProducts.includes(productId);
    if (productInCart)
      return res
        .status(400)
        .json({ message: "Product is already in cart!", error: true });

    const productBoughtAlready = user.purchasedProducts.includes(productId);
    if (productBoughtAlready)
      return res
        .status(400)
        .json({ message: "Product Bought Already!", error: true });

    req.user.cartProducts.push(productId);
    await req.user.save();
    await product.save();

    res.status(200).json({
      message: "Added to cart successfully!",
      success: true,
      user,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  buyProducts,
  getAllProducts,
  getUserPurchasedProducts,
  getUserCreatedProducts,
  addProductToCart,
  getUserCartProducts,
};
