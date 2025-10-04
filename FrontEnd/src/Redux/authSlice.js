import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: storedUser ? storedUser.user : null,
  token: storedUser ? storedUser.token : null,
  email: null, // to hold email waiting for OTP
  msg: "",
  loading: false,
  error: null,
};

// ✅ Register user → Step 1 (request OTP)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      // console.log("registerUser success:", response);
      return response;
    } catch (error) {
      console.error("registerUser error:", error); // ✅ Debug log
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Login user → Step 1 (request OTP)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Verify OTP → Step 2 (finalize login/register)
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, thunkAPI) => {
    try {
      return await authService.verifyOtp(otpData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "OTP verification failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.email = null;
      state.msg = "";
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Register (OTP requested)
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        // console.log("registerUser.pending"); 
      })
      // authSlice.js
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // ✅ Extract email properly from backend response
        state.user = action.payload.user || null;
        state.email = action.payload.user?.email || null; // <-- important
        state.msg = action.payload.message || "";
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("registerUser.rejected:", action.payload); // ✅ Debug
      })

      // ✅ Login (OTP requested)
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.msg = action.payload.msg || action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Verify OTP (finalize login/register)
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.msg = action.payload.msg || action.payload.message;
        state.email = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
