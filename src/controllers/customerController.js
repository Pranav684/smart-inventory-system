const Customer = require("../models/Customer");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// POST /api/customers
exports.createCustomer = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { name, phone, email, address, gstNumber, openingBalance } = req.body;

  if (!name) throw new ApiError(400, "Customer name is required!");

  const customer = await Customer.create({
    name,
    phone,
    email,
    address,
    gstNumber,
    openingBalance: openingBalance || 0,
    currentBalance: openingBalance || 0,
    isActive: true,
    createdBy: userId,
  });
  res
    .status(201)
    .json(new ApiResponse(201, customer, "Customer created successfully!"));
});

// GET /api/customers
exports.getCustomers = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { search } = req.query;

  const query = {
    createdBy: userId,
    isActive: true,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  const customers = await Customer.find(query).sort({
    createdAt: -1,
  });
  if (!customers)
    throw new ApiError(404, "Customers not found or your are not authorized!");
  // console.log(customers)
  res.json(new ApiResponse(200, customers, "Customers fetched successfully!"));
});

// GET /api/customers/:id
exports.getCustomerById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const customer = await Customer.findOne({
    _id: id,
    createdBy: userId,
    isActive: true,
  });
  if (!customer) throw new ApiError(404, "Customer not found!");
  res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer fetched successfully!"));
});

// PUT /api/customers/:id
exports.updateCustomer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const updateData = { ...req.body };

  const customer = await Customer.findOneAndUpdate(
    { createdBy: userId, _id: id , isActive:true},
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!customer) throw new ApiError(404, "Customer not found!");
  res.json(new ApiResponse(200, customer, "Customer updated successfully!"));
});

// DELETE /api/customers/:id
exports.deleteCustomer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const customer = await Customer.findOneAndUpdate(
    { createdBy: userId, _id: id, isActive: true },
    { isActive: false },
    { new: true }
  );
  if (!customer) throw new ApiError(404, "Customer not found!");
  res.json(
    new ApiResponse(200, customer, "Customer deactivated successfully!")
  );
});
