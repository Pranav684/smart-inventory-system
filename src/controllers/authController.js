const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, businessName } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    businessName,
  });

  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        },
        token,
      },
      "User registered successfully!"
    )
  );
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Passwrd are required!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "User does not exists!");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid pssword!");
  }

  const token = generateToken(user._id);

  res.json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        },
        token,
      },
      "Login Successful!"
    )
  );
});

// GET /api/auth/user
exports.getUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized");
  }
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  res.json(new ApiResponse(200, user, "User profile fetched successfully!"));
});
