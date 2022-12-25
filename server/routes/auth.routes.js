const express = require("express");
const {
  login,
  signup,
  logout,
} = require("../controllers/auth/auth.controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", authMiddleware, logout);

module.exports = router;
