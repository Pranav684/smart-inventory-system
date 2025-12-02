const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a title!"],
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      sparse: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    purchasePrice: {
      type: Number,
      required: [true, "Please provide a price!"],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    openingStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockAlert: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    categories: {
      type: [String],
      required: [true, "Please add a category!"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Text index for search on title + description
productSchema.index({ createdBy: 1, name: 1 }, { unique: true });
productSchema.index({ createdBy: 1, sku: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Product", productSchema);
