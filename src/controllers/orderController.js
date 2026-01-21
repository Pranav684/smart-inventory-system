const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const { ApiResponse } = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

exports.createOrder = asyncHandler(async (req, res) => {
  const {
    customerId,
    items,
    discount = 0,
    paymentMode,
    paymentStatus,
  } = req.body;
  const userId = req.user_id;

  const customer = await Customer.findOne({
    _id: customerId,
    createdBy: userId,
    isActive: true,
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found!");
  }

  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findOne({
      _id: item.productId,
      createdBy: userId,
      isActive: true,
    });

    if (!product) {
      throw new ApiError(404, "Product not found : ${item.productId}");
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        404,
        "Insufficient stock for product: ${product.name}"
      );
    }
    
  }
});
