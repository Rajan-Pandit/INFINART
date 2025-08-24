const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  originalPrice: {
    type: Number,
  },

  discountPercentage: {
    type: Number,
  },

  images: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },

  category: {
    type: String,
    required: true,
  },

  subcategory: {
    type: String,
  },

  rating: {
    type: Number,
    default: 0,
  },

  inStock: {
    type: Number,
    required: true,
    default: 0,
  },

  tags: {
    type: [String],
  },

  // ✅ Seller-related fields (cleaned up)
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", // now points to Seller model instead of User
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model("Product", productSchema);
