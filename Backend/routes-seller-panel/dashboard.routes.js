// routes/dashboard.js
const express = require("express");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Seller = require("../models/seller.model"); // ✅ import seller model

const router = express.Router();

router.get("/stats/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    // 1️⃣ Check if seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // 2️⃣ Count total products
    const totalProducts = await Product.countDocuments({ sellerId });

    // 3️⃣ Get orders & populate products
    const orders = await Order.find({}).populate("products.product");

    let totalRevenue = 0;
    let totalOrders = 0;
    const customerSet = new Set();

    orders.forEach((order) => {
      let hasSellerProduct = false;

      order.products.forEach((item) => {
        if (item.product?.sellerId?.toString() === sellerId) {
          hasSellerProduct = true;
          totalRevenue += item.price * item.quantity;
        }
      });

      if (hasSellerProduct) {
        totalOrders++;
        customerSet.add(order.user.toString());
      }
    });

    const totalCustomers = customerSet.size;

    // ✅ Include seller info
    res.json({
      sellerId: seller._id,
      sellerName: seller.sellerName,
      storeName: seller.storeName,
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    res.status(500).json({
      message: "Error fetching stats",
      error: error.message,
    });
  }
});

module.exports = router;
