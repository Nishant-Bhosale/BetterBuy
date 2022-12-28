const express = require("express");
const {
  createProduct,
  updateProduct,
  buyProducts,
  getUserPurchasedProducts,
  getAllProducts,
  getUserCreatedProducts,
  getUserCartProducts,
  addProductToCart,
} = require("../controllers/product/product.controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const multer = require("multer");

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|jfif|PNG)$/)) {
      return cb(new Error("Please upload valid image format"));
    }
    return cb(undefined, true);
  },
  limits: {
    fileSize: 1000000,
  },
});

router.get("/all", getAllProducts);
router.post("/buy", authMiddleware, buyProducts);
router.put("/edit/:id", authMiddleware, updateProduct);
router.get("/purchased", authMiddleware, getUserPurchasedProducts);
router.get("/my/products", authMiddleware, getUserCreatedProducts);
router.post("/create", upload.single("image"), authMiddleware, createProduct);
router.route("/cart/:id").post(authMiddleware, addProductToCart);
router.route("/cart").get(authMiddleware, getUserCartProducts);

module.exports = router;
