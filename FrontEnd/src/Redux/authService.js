import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// ✅ Check server status
const checkServerStatus = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/server-status`);
    return res.data.bootTime;
  } catch (error) {
    throw new Error("Failed to fetch server status");
  }
};

// ✅ Register (Step 1: send OTP)
const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/users/register`, userData);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data);
    throw error;
  }
};

// ✅ Verify OTP (Step 2: finalizing registration)
const verifyOtp = async (otpData) => {
  try {
    const res = await axios.post(`${API_URL}/users/verify-otp`, otpData);
    return res.data;
  } catch (error) {
    console.error("OTP verification error:", error.response?.data);
    throw error;
  }
};

// ✅ Resend OTP
const resendOtp = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/users/resend-otp`, data);
    return res.data;
  } catch (error) {
    console.error("Resend OTP error:", error.response?.data);
    throw error;
  }
};

// ✅ Login (Direct login - NO OTP)
const login = async (userData) => {
  try {
  
    
    const res = await axios.post(`${API_URL}/users/login`, userData);
    
    return res.data;
  } catch (error) {
    ;
    throw error;
  }
};

const authService = { register, login, verifyOtp, checkServerStatus, resendOtp };
export default authService;