// services/sellerPanelService.js
const Seller = require("../models/seller.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER
const registerSellerService = async (sellerData) => {
  const { email, password } = sellerData;

  // Check if email exists
  const sellerExists = await Seller.findOne({ email });
  if (sellerExists) {
    throw new Error("Seller already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create seller
  const seller = await Seller.create({
    ...sellerData,
    password: hashedPassword,
  });

  if (!seller) {
    throw new Error("Invalid seller data");
  }

  return {
    seller,
    token: generateToken(seller._id),
  };
};

// LOGIN
const loginSellerService = async ({ email, password }) => {
  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, seller.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    seller,
    token: generateToken(seller._id),
  };
};

// GET PROFILE
const getSellerProfileService = async (sellerId) => {
  const seller = await Seller.findById(sellerId).select("-password");
  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller;
};

module.exports = {
  registerSellerService,
  loginSellerService,
  getSellerProfileService,
};
