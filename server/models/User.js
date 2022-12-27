const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    cartProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    purchasedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.statics.findUserByCredentials = async (email, password) => {
  try {
    password = password.toString();
    const user = await User.findOne({ email });

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Please enter correct password.");
    }

    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const payload = { _id: user._id };

  const token = await jwt.sign(payload, process.env.secretKey);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  user.password = hashedPassword;
  return next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
