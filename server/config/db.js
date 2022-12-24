const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const { DB_PRODUCTION } = process.env;
  console.log(DB_PRODUCTION);
  try {
    await mongoose.connect(DB_PRODUCTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
