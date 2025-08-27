const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const multer = require("multer");
const path = require("path");

const { protect } = require("../Middleware/authMiddleware");

// Helpers for ensuring human orderId and per-item itemIds exist
function generateBaseNumericId() {
  const timestampPart = Date.now().toString();
  const randomPart = String(Math.floor(10000 + Math.random() * 90000));
  return `${timestampPart}${randomPart}`;
}

function ensureOrderIds(order) {
  let changed = false;
  // Ensure orderId
  if (!order.orderId) {
    const base = generateBaseNumericId();
    order.orderId = `OD${base}`;
    changed = true;
  }
  const baseForItems = String(order.orderId).startsWith('OD') ? String(order.orderId).slice(2) : generateBaseNumericId();
  // Ensure per-item itemId
  if (Array.isArray(order.products)) {
    order.products.forEach((p, idx) => {
      if (!p.itemId) {
        try {
          const itemId = String(BigInt(baseForItems) + BigInt(idx));
          p.itemId = itemId;
          changed = true;
        } catch (_) {
          p.itemId = `${baseForItems}${idx}`;
          changed = true;
        }
      }
    });
  }
  return changed;
}

// 🔐 Create a new order (user must be logged in)
router.post("/", protect, async (req, res) => {
  try {
    const payload = {
      user: req.user._id,
      products: Array.isArray(req.body.products) ? req.body.products.map((p) => ({
        product: p.product,
        quantity: p.quantity,
        price: p.price,
      })) : [],
      totalAmount: req.body.totalAmount,
      paymentStatus: req.body.paymentStatus,
      deliveryStatus: req.body.deliveryStatus,
      shippingAddress: req.body.shippingAddress,
    };

    const newOrder = new Order(payload);
    const saved = await newOrder.save();
    
    // Populate product information before sending response
    const populatedOrder = await Order.findById(saved._id).populate('products.product');
    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get orders for currently logged-in user
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    // Normalize IDs for any legacy orders missing them
    for (const o of orders) {
      const changed = ensureOrderIds(o);
      if (changed) await o.save();
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧍 Get orders by user ID (admin functionality)
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Get single order by order ID
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    let order = null;
    // Try by Mongo ObjectId first
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId).populate('products.product');
    }
    // If not found, try by human-readable orderId
    if (!order) {
      order = await Order.findOne({ orderId }).populate('products.product');
    }
    if (!order) return res.status(404).json({ message: "Order not found" });
    const changed = ensureOrderIds(order);
    if (changed) {
      await order.save();
      order = await Order.findById(order._id).populate('products.product');
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Cancel order by order ID
router.patch("/:orderId/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }
    
    // Check if order can be cancelled (only processing orders can be cancelled)
    if (order.deliveryStatus !== 'Processing') {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }
    
    // Update order status to cancelled
    order.deliveryStatus = 'Cancelled';
    order.cancelledAt = new Date();
    
    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id).populate('products.product');
    
    res.status(200).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer setup for review image uploads (store in /uploads)
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
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images are allowed'));
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

// ✅ Check review eligibility for a product: user must have a delivered order containing product
router.get('/eligibility/review/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const hasPurchased = await Order.exists({
      user: req.user._id,
      deliveryStatus: /delivered/i,
      'products.product': productId,
    });
    res.json({ eligible: Boolean(hasPurchased) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ⭐ Submit rating for an order (supports multiple images)
router.post(
  "/:orderId/rating",
  protect,
  upload.array('photos', 6),
  async (req, res) => {
    try {
      const { stars, text } = req.body;

      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check ownership
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to rate this order" });
      }

      // Check delivered (case-insensitive)
      if ((order.deliveryStatus || '').toLowerCase() !== 'delivered') {
        return res.status(400).json({ message: "Can only rate delivered orders" });
      }

      // Check not already rated
      if (order.rating && order.rating.stars) {
        return res.status(400).json({ message: "Order already rated" });
      }

      const photoUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);

      order.rating = {
        stars: Number(stars),
        text: text || '',
        photos: photoUrls,
        submittedAt: new Date(),
      };

      const updatedOrder = await order.save();
      const populatedOrder = await Order.findById(updatedOrder._id).populate('products.product');

      // Also create a product review for the first product in the order
      if (order.products && order.products.length > 0) {
        const Product = require('../models/product.model');
        const product = await Product.findById(order.products[0].product);
        
        if (product) {
          // Check if user has already reviewed this product
          const alreadyReviewed = (product.reviews || []).some((r) => r.user?.toString() === req.user._id.toString());
          
          if (!alreadyReviewed) {
            // Add review to product
            product.reviews.push({
              user: req.user._id,
              stars: Number(stars),
              text: text || '',
              photos: photoUrls,
              createdAt: new Date(),
            });

            // Update average rating
            const total = product.reviews.reduce((sum, r) => sum + r.stars, 0);
            product.rating = product.reviews.length > 0 ? Number((total / product.reviews.length).toFixed(1)) : 0;

            await product.save();
          }
        }
      }

      res.status(200).json(populatedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;