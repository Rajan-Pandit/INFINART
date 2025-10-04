import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL; // e.g., http://localhost:5000

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
  //  console.log("API_URL:", API_URL); 
    // console.log("Sending to backend:", userData); 
    const res = await axios.post(`${API_URL}/users/register`, userData);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data); // ✅ Log backend error
    throw error;
  }
};

// ✅ Verify OTP (Step 2: finalizing register/login)
const verifyOtp = async (otpData) => {
  try {
    const res = await axios.post(`${API_URL}/users/verify-otp`, otpData);
    const serverBootTime = await checkServerStatus();
    const userDataWithBoot = { ...res.data, bootTime: serverBootTime };
    localStorage.setItem("user", JSON.stringify(userDataWithBoot));
    return userDataWithBoot;
  } catch (error) {
    console.error("OTP verification error:", error.response?.data); // ✅ Log backend error
    throw error;
  }
};

// ✅ Login (Step 1: send OTP)
const login = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, userData);
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data); // ✅ Log backend error
    throw error;
  }
};

const authService = { register, login, verifyOtp, checkServerStatus };
export default authService;