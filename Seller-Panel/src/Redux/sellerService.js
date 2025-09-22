// src/services/sellerService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/seller";

// Function to get the seller profile
const getSellerProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/profile`, config);

  if (response.data.success) {
    return response.data.seller;
  } else {
    throw new Error(response.data.message || "Failed to fetch profile");
  }
};

// Function to update the seller profile
const updateSellerProfile = async (profileData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put(`${API_URL}/profile`, profileData, config);

  if (response.data.success) {
    return response.data.seller;
  } else {
    throw new Error(response.data.message || "Failed to update profile");
  }
};

const sellerService = {
  getSellerProfile,
  updateSellerProfile,
};

export default sellerService;
