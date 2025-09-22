
import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard/";
const PRODUCTINFO_URL = "http://localhost:5000/api/productinfo/";

// 👉 Fetch seller dashboard stats
const getSellerStats = async (sellerId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // keep auth for now
    },
  };

  const response = await axios.get(API_URL + `stats/${sellerId}`, config);
  return response.data;
};

// 👉 Fetch seller products
const getSellerProducts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(PRODUCTINFO_URL + "my", config);
  return response.data;
};

const dashboardService = {
  getSellerStats,
  getSellerProducts,
};

export default dashboardService;
