const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
require("dotenv").config();

const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");

app.use(express.json({ extended: false }));
app.use(cors());

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
