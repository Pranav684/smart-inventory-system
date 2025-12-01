const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title!"],
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    required: [true, "Please provide a price!"],
  },
  stock: {
    type: String,
    required: [true, "Please provide stock size!"],
  },
  category: {
    type: String,
    required: [true, "Please add a category!"],
  },
  images: {
    type: [String],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = productSchema;
