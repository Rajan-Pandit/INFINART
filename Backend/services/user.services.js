// services/user.services.js
const userModel = require('../models/user.model');

/**
 * Create a new user (unverified)
 */
async function createUser({ firstname, lastname, email, password }) {
  if (!firstname || !lastname || !email || !password) {
    throw new Error('All fields are required');
  }

  // Check if user already exists
  const existing = await userModel.findOne({ email });
  if (existing) {
    throw new Error('Email already in use');
  }

  const user = await userModel.create({
    fullname: { firstname, lastname },
    email,
    password,
    isVerified: false,
  });

  return user;
}

/**
 * Save OTP & expiry to user document
 */
async function saveOtpForUser(email, otp, expiresAt) {
  const user = await userModel.findOneAndUpdate(
    { email },
    { otp, otpExpires: expiresAt },
    { new: true, useFindAndModify: false }
  );
  return user;
}

/**
 * Mark user as verified and remove otp fields
 */
async function verifyUserEmail(email) {
  const user = await userModel.findOneAndUpdate(
    { email },
    { isVerified: true, otp: undefined, otpExpires: undefined },
    { new: true, useFindAndModify: false }
  );
  return user;
}

module.exports = {
  createUser,
  saveOtpForUser,
  verifyUserEmail,
};
