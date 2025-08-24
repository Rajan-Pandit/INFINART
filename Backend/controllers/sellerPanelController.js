// controllers/sellerPanelController.js
const {
  registerSellerService,
  loginSellerService,
  getSellerProfileService,
} = require("../services/sellerPanelService");

// REGISTER
const registerSeller = async (req, res, next) => {
  try {
    const result = await registerSellerService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// LOGIN
const loginSeller = async (req, res, next) => {
  try {
    const result = await loginSellerService(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET PROFILE (Protected)
const getSellerProfile = async (req, res, next) => {
  try {
    // req.user should be set by your auth middleware after verifying token
    const sellerId = req.user.id;  
    const result = await getSellerProfileService(sellerId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  getSellerProfile,
};
