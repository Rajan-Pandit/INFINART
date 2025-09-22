// routes/SellerPanel.routes.js
const express = require("express");
const { registerSeller, loginSeller, getSellerProfile } = require("../controllers/sellerPanelController");
const { protect } = require("../Middleware/sellerPanelauthMidWar");
const router = express.Router();

// Public routes (no authentication needed)
router.post("/register", registerSeller);
router.post("/login", loginSeller);

// Protected routes (authentication required)
router.get("/profile", protect, getSellerProfile);

module.exports = router;