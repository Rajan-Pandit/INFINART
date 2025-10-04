// controllers/user.controllers.js
const userModel = require('../models/user.model');
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===== Register user - create unverified user, send OTP =====
module.exports.registerUser = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { fullname, email, password } = req.body;

    if (!fullname || !fullname.firstname || !fullname.lastname) {
      return res.status(400).json({ message: 'Fullname fields are required' });
    }

    const { firstname, lastname } = fullname;

    // Hash password
    const hashedPassword = await userModel.hashPassword(password);

    // Create user via service (will throw if email exists)
    const user = await userService.createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // Generate OTP and expiry (5 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save otp fields on user (service)
    await userService.saveOtpForUser(email, otp, otpExpiry);

    // Send OTP email (best-effort)
    const subject = 'Your verification OTP';
    const text = `Your OTP is: ${otp}. It expires in 5 minutes.`;
    const html = `<p>Your OTP is: <strong>${otp}</strong></p><p>It expires in 5 minutes.</p>`;

    try {
      await sendEmail({ to: email, subject, text, html });
    } catch (mailErr) {
      console.error('Failed to send OTP email:', mailErr);
      // continue - still return user created but inform that mail failed
      return res.status(201).json({
        message: 'User created but failed to send OTP email. Contact support or try resending OTP.',
        user: { email: user.email, id: user._id },
      });
    }

    return res.status(201).json({
      message: 'User created. OTP sent to email. Verify to complete registration.',
      user: { email: user.email, id: user._id },
    });
  } catch (err) {
    console.error(err);
    // if duplicate key error
    if (err.message && err.message.includes('Email already in use')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ===== Verify OTP =====
module.exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // find user and include otp fields
    const user = await userModel.findOne({ email }).select('+otp +otpExpires +password +isVerified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified. Please login.' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'No OTP found. Request a new one.' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // mark verified
    const verifiedUser = await userService.verifyUserEmail(email);

    // Generate auth token now that user is verified
    const token = await verifiedUser.generateAuthToken();

    // remove sensitive fields before sending
    const userObj = verifiedUser.toObject();
    delete userObj.otp;
    delete userObj.otpExpires;

    return res.status(200).json({ message: 'Email verified', token, user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ===== Resend OTP =====
module.exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified. Please login.' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await userService.saveOtpForUser(email, otp, otpExpiry);

    const subject = 'Your verification OTP (resend)';
    const text = `Your OTP is: ${otp}. It expires in 5 minutes.`;
    const html = `<p>Your OTP is: <strong>${otp}</strong></p><p>It expires in 5 minutes.</p>`;

    try {
      await sendEmail({ to: email, subject, text, html });
    } catch (mailErr) {
      console.error('Failed to send OTP email:', mailErr);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    return res.status(200).json({ message: 'OTP resent to email' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ===== Login user (only verified users allowed) =====
module.exports.loginUser = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email }).select('+password +isVerified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify via OTP.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = await user.generateAuthToken();

    // Remove sensitive fields before sending response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otp;
    delete userObj.otpExpires;

    res.status(200).json({ token, user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ===== User profile (unchanged) =====
module.exports.userProfile = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ success: false, user: null });
  }
  res.status(200).json({
    success: true,
    user: req.user
  });
};
