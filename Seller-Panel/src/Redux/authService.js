import axios from "axios";

// PLACE BACKEND URL HERE
const API_URL = {
  REGISTER: "http://localhost:5000/api/seller/register", // Change to your backend endpoint
  LOGIN: "http://localhost:5000/api/seller/login",       // Change to your backend endpoint
};

// REGISTER SELLER
const registerSeller = async (sellerData) => {
  const response = await axios.post(API_URL.REGISTER, sellerData);
  if (response.data.token) {
    localStorage.setItem("sellerToken", response.data.token);
  }
  return response.data;
};

// LOGIN SELLER
const loginSeller = async (loginData) => {
  const response = await axios.post(API_URL.LOGIN, loginData);
  if (response.data.token) {
    localStorage.setItem("sellerToken", response.data.token);
  }
  return response.data;
};

// LOGOUT
const logout = () => {
  localStorage.removeItem("sellerToken");
};

const authService = {
  registerSeller,
  loginSeller,
  logout,
};

export default authService;
