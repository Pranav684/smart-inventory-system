const Product = require("../src/models/Product");
const { parsePagination } = require("../utils/paginate");

// POST api/product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, images } = req.body;
    if (!title || price === undefined)
      return res.status(400).json({ message: "Title and Price are required!" });
    const product = await Product.create({
      title,
      description: description || "",
      price,
      stock: stock || 0,
      category: category || "general",
      images: images || [],
      createdBy: req.user._id || req.user,
    });
    return res
      .status(201)
      .json({ message: "Product created!", product: product });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};
