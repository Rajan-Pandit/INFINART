// src/Redux/authService.js
import axios from "axios";

// PLACE BACKEND URL HERE
const API_URL = {
  REGISTER: "http://localhost:5000/api/seller/register", 
  LOGIN: "http://localhost:5000/api/seller/login",       
};

// REGISTER SELLER
const registerSeller = async (sellerData) => {
  try {
    const response = await axios.post(API_URL.REGISTER, sellerData);
    
    if (response.data.success && response.data.token) {
      localStorage.setItem("sellerToken", response.data.token);
      localStorage.setItem("sellerData", JSON.stringify(response.data.seller));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    const message = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(message);
  }
};

// LOGIN SELLER
const loginSeller = async (loginData) => {
  try {
    const response = await axios.post(API_URL.LOGIN, loginData);
    
    if (response.data.success && response.data.token) {
      localStorage.setItem("sellerToken", response.data.token);
      localStorage.setItem("sellerData", JSON.stringify(response.data.seller));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const message = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(message);
  }
};

// LOGOUT
const logout = () => {
  localStorage.removeItem("sellerToken");
  localStorage.removeItem("sellerData");
};

const authService = {
  registerSeller,
  loginSeller,
  logout,
};

export default authService;