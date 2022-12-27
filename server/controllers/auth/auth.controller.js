require("dotenv").config();
const User = require("../../models/User");
const validateEmail = require("../../utils/validateEmail");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
      return res
        .status(404)
        .json({ message: "Please enter valid email", error: true });
    }

    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      res.status(404).json({
        message: "Please enter correct email and password.",
        error: true,
      });
      return;
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
      user: { ...user._doc, password: null, token, tokens: null },
      sucess: true,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Server Error", error: true });
  }
};

const signup = async (req, res) => {
  let { name, email, password } = req.body;

  if (name === "" || email === "" || password === "")
    return res
      .status(404)
      .json({ error: true, message: "Please enter valid credentials!" });

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists", error: true });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    const token = await newUser.generateAuthToken();

    res.status(201).json({ user: { ...newUser._doc, token }, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal Server Error!" });
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenObj) => {
      return tokenObj.token != req.token;
    });

    await req.user.save();
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!", error: true });
  }
};

module.exports = { login, signup, logout };
