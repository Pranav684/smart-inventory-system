const express = require("express");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const customerRoutes = require("./routes/customer");
const { errorHandler } = require("./utils/ApiError");

const app = express();

// Connect mongodb
connectDB();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// routes
app.get("/", (req, res) => res.send("Api is running..."));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);

app.use(errorHandler);

module.exports = app;
