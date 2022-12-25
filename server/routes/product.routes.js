const express = require("express");
const {
  createProduct,
  updateProduct,
  buyProduct,
  getUserPurchasedProducts,
  getAllProducts,
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
router.get("/purchased", authMiddleware, getUserPurchasedProducts);
router.post("/create", upload.single("image"), authMiddleware, createProduct);
router.put("/edit/:id", authMiddleware, updateProduct);
router.post("/buy/:id", authMiddleware, buyProduct);

module.exports = router;
