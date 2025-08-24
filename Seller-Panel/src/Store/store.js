import { configureStore } from '@reduxjs/toolkit';
import testReducer from '../Redux/testSlice';
import authReducer from '../Redux/authSlice';
import productsReducer from "../Redux/productSlice";
import sellerReducer from "../Redux/sellerSlice"


const store = configureStore({
  reducer: {
    test: testReducer,
    auth :authReducer,
     products: productsReducer,
     seller: sellerReducer
  }
});

export default store;
