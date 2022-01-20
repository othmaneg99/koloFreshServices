const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const shopRouter = require("./routes/shops");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const requestRouter = require("./routes/demande");
const res = require("express/lib/response");
require("dotenv").config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Add here your routes

app.use("/shop", shopRouter);
app.use("/auth", authRouter);
app.use("/prod", productRouter);
app.use("/demande", requestRouter);
app.use("/", (req, res, next) => {
  res.send("Hello World");
});

//exporting the
module.exports = app;
