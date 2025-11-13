const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

//  POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check data validity
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Please provide name, email and password." });
    const isExist = await User.findOne({ email });
    if (isExist)
      return res.status(400).json({ message: "User already exists." });

    // password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save user and create token
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error!" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Provide proper credentials!" });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User do not exists!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "User login successful!",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error!" });
  }
});

// GET /api/auth/profile    (protected)
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne(req.user).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
