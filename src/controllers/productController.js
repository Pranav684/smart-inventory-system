const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// POST api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    name,
    sku,
    description,
    categories,
    purchasePrice,
    sellingPrice,
    openingStock,
    lowStockAlert,
    images,
  } = req.body;
  if (!name || !categories || !purchasePrice || !sellingPrice)
    throw new ApiError(
      400,
      "name, categories, purchasePrice and sellingPrice are required!"
    );

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new ApiError(400, "categories must be a non-empty list!");
  }
  const product = await Product.create({
    name,
    sku,
    description,
    purchasePrice,
    sellingPrice: sellingPrice,
    categories,
    openingStock: openingStock || 0,
    currentStock: openingStock || 0,
    lowStockAlert: lowStockAlert || 0,
    images: images || [],
    createdBy: userId,
  });
  res.json(new ApiResponse(201, product, "Product created Successfully"));
});

// GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const products = await Product.find({
    createdBy: userId,
    isActive: true,
  }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, products, "Products fetched successfully!"));
});

// GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const product = await Product.findOne({
    _id: id,
    createdBy: userId,
    isActive: true,
  });

  if (!product) throw new ApiError(404, "Product not found!");

  res.json(new ApiResponse(200, product, "Product fetched successfully!"));
});

// PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const updateData = { ...req.body };
  console.log(userId);
  console.log(id);
  // Never allow changing owener from API
  delete updateData.createdBy;

  const product = await Product.findOneAndUpdate(
    {
      _id: id,
      createdBy: userId,
    },
    updateData,
    { new: true, runValidators: true }
  );

  if (!product)
    throw new ApiError(404, "Product not found or not owned by the user!");
  res.json(new ApiResponse(200, product, "Product updated successfully"));
});

// DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const product = await Product.findOneAndUpdate(
    {
      createdBy: userId,
      _id: id,
    },
    { isActive: false },
    { new: true }
  );
  if (!product)
    throw new ApiError(404, "Product not found or not owned by the user!");

  res.json(new ApiResponse(200, product, "Product deactivated successfully!"));
});
