const express = require("express");
const connectDB = require("./config/db");
const app = express();

app.use(express.json({ extended: false }));

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
