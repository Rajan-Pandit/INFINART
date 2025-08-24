// middlewares/authAndErrorMiddleware.js
const jwt = require("jsonwebtoken");
const Seller = require("../models/seller.model");

// Protect Middleware - Auth check
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach seller info to req object
      req.seller = await Seller.findById(decoded.id).select("-password");

      if (!req.seller) {
        return res.status(401).json({ success: false, message: "Seller not found" });
      }

      return next();
    }

    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { protect, errorHandler };
