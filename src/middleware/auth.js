const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');

const auth = async (req, res, next) => {
  let token;

  // Expect header: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to req
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized, token failed'));
  }
};

module.exports = auth;
