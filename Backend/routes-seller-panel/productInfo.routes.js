// routes/productInfo.routes.js
const express = require("express");
const Product = require("../models/product.model");
const { protect } = require("../Middleware/sellerPanelauthMidWar");

const router = express.Router();

/**
 * @desc Get all products for the logged-in seller
 * @route GET /api/products/my
 * @access Private (seller only)
 */
router.get("/my", protect, async (req, res) => {
  try {
     
    const sellerId = req.user.id; // comes from protect middleware

    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ Fetch seller products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching seller products",
    });
  }
});

module.exports = router; // must be there

