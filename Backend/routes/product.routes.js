const express = require("express");
const Product = require("../models/product.model");
const { protect } = require("../Middleware/authMiddleware");
const Order = require("../models/order.model");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// GET all products with optional tag or storeName filter
router.get("/", async (req, res) => {
  try {
    const { tag, store } = req.query;

    const filter = {};

    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }

    if (store) {
  filter.storeName = { $regex: new RegExp(`^${store}$`, "i") }; // case-insensitive exact match
}

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// (Optional) GET products by storeName as a path param route if needed
router.get("/store/:storeName", async (req, res) => {
  try {
    const { storeName } = req.params;

    const products = await Product.find({ storeName });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this store" });
    }

    res.json(products);
  } catch (err) {
    console.error("Error fetching store products:", err);
    res.status(500).json({ error: "Server error fetching store products" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

module.exports = router;

// --- Below: product reviews ---

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true); else cb(new Error('Only images are allowed'));
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

// POST: add product review with optional multiple images
router.post('/:id/reviews', protect, upload.array('photos', 6), async (req, res) => {
  try {
    const { stars, text } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Enforce: only one review per user per product
    const alreadyReviewed = (product.reviews || []).some((r) => r.user?.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Enforce: user must have purchased this product to review
    const hasPurchased = await Order.exists({ 
      user: req.user._id, 
      'products.product': product._id 
    });
    if (!hasPurchased) {
      return res.status(403).json({ error: 'Only customers who purchased this product can review' });
    }

    const photos = (req.files || []).map((f) => `/uploads/${f.filename}`);

    product.reviews.push({
      user: req.user._id,
      stars: Number(stars),
      text: text || '',
      photos,
      createdAt: new Date(),
    });

    // Update average rating
    const total = product.reviews.reduce((sum, r) => sum + r.stars, 0);
    product.rating = product.reviews.length > 0 ? Number((total / product.reviews.length).toFixed(1)) : 0;

    await product.save();
    
    // Also update the order rating for this user and product
    const order = await Order.findOne({
      user: req.user._id,
      deliveryStatus: 'Delivered',
      'products.product': product._id,
    });
    
    if (order && !order.rating) {
      order.rating = {
        stars: Number(stars),
        text: text || '',
        photos,
        submittedAt: new Date(),
      };
      await order.save();
    }
    
    res.json(product);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// GET: list reviews for a product
router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'fullname email');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product.reviews || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST: mark a review as helpful (idempotent per user)
router.post('/:productId/reviews/:reviewId/helpful', protect, async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Find review by _id instead of using .id() method
    const review = (product.reviews || []).find(r => r._id.toString() === reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const userId = req.user._id.toString();
    const alreadyVoted = (review.helpfulVoters || []).some((u) => u.toString() === userId);
    if (!alreadyVoted) {
      review.helpfulVoters = review.helpfulVoters || [];
      review.helpfulVoters.push(req.user._id);
      review.helpfulCount = typeof review.helpfulCount === 'number' ? review.helpfulCount + 1 : 1;
      await product.save();
    }

    return res.json({ reviewId, helpfulCount: review.helpfulCount });
  } catch (err) {
    console.error('Error updating helpful count:', err);
    res.status(500).json({ error: 'Failed to update helpful count' });
  }
});