const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(400)
      .json({ message: "No Authorization Access Denied", error: true });
  }

  try {
    const decodedUser = await jwt.verify(token, process.env.secretKey);

    const user = await User.findOne({
      _id: decodedUser._id,
      "tokens.token": token,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found", error: true });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Token is invalid", error: true });
  }
};
