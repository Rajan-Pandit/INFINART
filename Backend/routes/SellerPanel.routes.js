    const express = require("express");
    const { registerSeller, loginSeller,getSellerProfile } = require("../controllers/sellerPanelController");
    const {protect}   = require("../Middleware/sellerPanelauthMidWar");
    const router = express.Router();

    router.post("/register", registerSeller);
    router.post("/login", loginSeller);
    router.get("/profile", protect, getSellerProfile);

    module.exports = router;
