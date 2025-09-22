
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "./dashboardService";

// 👉 Initial state
const initialState = {
  stats: null,
  products: [], // NEW field for seller products
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// 👉 Async thunk to fetch stats
export const fetchSellerStats = createAsyncThunk(
  "dashboard/fetchStats",
  async ({ sellerId, token }, thunkAPI) => {
    try {
      return await dashboardService.getSellerStats(sellerId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 👉 Async thunk to fetch seller products
export const fetchSellerProducts = createAsyncThunk(
  "dashboard/fetchProducts",
  async (token, thunkAPI) => {
    try {
      return await dashboardService.getSellerProducts(token);
    } catch (error) {
      console.error("❌ fetchSellerProducts error:", error.response?.data || error.message);
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 👉 Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    reset: (state) => {
      state.stats = null;
      state.products = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats reducers
      .addCase(fetchSellerStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSellerStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(fetchSellerStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.stats = null;
      })

      // Products reducers
      .addCase(fetchSellerProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.products; // backend sends { success, count, products }
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.products = [];
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
