import { configureStore } from '@reduxjs/toolkit';
import testReducer from '../Redux/testSlice';
import authReducer from '../Redux/authSlice';
import productsReducer from "../Redux/productSlice";
import sellerReducer from "../Redux/sellerSlice";
import dashboardReducer from "../Redux/dashboardSlice"; // ✅ import

const store = configureStore({
  reducer: {
    test: testReducer,
    auth: authReducer,
    products: productsReducer,
    seller: sellerReducer,
    dashboard: dashboardReducer, // ✅ add dashboard slice
  },
});

export default store;
