require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect mongodb
connectDB();

// Middleware
app.use(express.json());

// routes
app.get('/', (req, res) => res.send("Api is running..."));

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
