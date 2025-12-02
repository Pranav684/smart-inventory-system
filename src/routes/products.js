const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const auth = require("../middleware/auth");

// All product route must be protected
router.use(auth);

// POST
router.post("/", createProduct);

// PUT
router.put("/:id", updateProduct);

// GET
router.get("/", getProducts);
router.get("/:id", getProductById);

// DELETE
router.delete("/:id", deleteProduct);

module.exports = router;
