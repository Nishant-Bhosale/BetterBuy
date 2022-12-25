const Product = require("../../models/Product");
const User = require("../../models/User");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ sold: false, forSale: true });

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
    res.status(200).json({ success: true, products: user.purchasedProducts });
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

    const updatedProduct = await Product.findOneAndUpdate(productId, {
      forSale,
    });

    res.status(202).json({
      message: "Product updated successfully",
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

const buyProduct = async (req, res) => {
  let {
    params: { id: productId },
    user,
  } = req;

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
        message: "Cannot buy the product created by you!",
        error: true,
      });
    }

    const productBoughtAlready = user.purchasedProducts.includes(productId);
    if (productBoughtAlready)
      return res
        .status(400)
        .json({ message: "Product Bought Already!", error: true });

    product.sold = true;
    product.forSale = false;
    req.user.purchasedProducts.push(productId);
    await req.user.save();
    await product.save();

    res.status(200).json({
      message: "Purchased successfully",
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
  buyProduct,
  getAllProducts,
  getUserPurchasedProducts,
};
