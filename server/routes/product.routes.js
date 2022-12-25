const express = require("express");
const {
  createProduct,
  updateProduct,
} = require("../controllers/product/product.controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createProduct);
router.put("/edit", authMiddleware, updateProduct);

module.exports = router;
