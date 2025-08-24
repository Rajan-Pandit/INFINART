const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "seller",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "suspended"],
    default: "pending",
  },

  // Business Details
  businessType: {
    type: String,
    enum: ["individual", "partnership", "private_limited", "other"],
    default: "individual",
  },
  gstNumber: {
    type: String,
  },
  registrationNumber: {
    type: String,
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },

  // Banking & Payment
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    upiId: String,
  },

  // Verification
  governmentIdProof: String, // file URL
  addressProof: String,      // file URL
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },

  // Tracking
  totalProducts: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },

  dateJoined: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Seller", sellerSchema);
