const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");

app.use(express.json({ extended: false }));
app.use(cors());

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
