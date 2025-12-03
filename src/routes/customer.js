const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const auth = require("../middleware/auth");

// All customer routes are protected
router.use(auth);

// POST
router.post("/", createCustomer);

// GET
router.get("/", getCustomers);
router.get("/:id", getCustomerById);

// PUT
router.put("/:id", updateCustomer);

// Delete
router.delete("/:id", deleteCustomer);

module.exports = router;
