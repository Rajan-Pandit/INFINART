import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: storedUser ? storedUser.user : null,
  token: storedUser ? storedUser.token : null,
  email: null,
  msg: "",
  loading: false,
  error: null,
};

// ✅ Register user → With OTP (keep as is)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// ✅ Login user → Direct login WITHOUT OTP
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
    
      const response = await authService.login(userData);
     

      // ✅ Get server status and combine with user data
      const serverBootTime = await authService.checkServerStatus();
      const userDataWithBoot = {
        ...response,
        bootTime: serverBootTime,
      };

      // ✅ Store in localStorage immediately
      localStorage.setItem("user", JSON.stringify(userDataWithBoot));
    

      return userDataWithBoot;
    } catch (error) {
    
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Verify OTP → Only for registration
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, thunkAPI) => {
    try {
      const response = await authService.verifyOtp(otpData);
      const serverBootTime = await authService.checkServerStatus();
      const userDataWithBoot = { ...response, bootTime: serverBootTime };
      localStorage.setItem("user", JSON.stringify(userDataWithBoot));
      return userDataWithBoot;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "OTP verification failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Resend OTP thunk
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, thunkAPI) => {
    try {
      const response = await authService.resendOtp(data);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.msg || "Resend OTP failed";
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
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user || null;
        state.email = action.payload.user?.email || null;
        state.msg = action.payload.message || "";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Login (Direct login - NO OTP)
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // In the loginUser.fulfilled case:
      .addCase(loginUser.fulfilled, (state, action) => {
      
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.msg = action.payload.msg || action.payload.message;
        state.email = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Verify OTP (Only for registration)
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
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Resend OTP states (do not affect user/token)
    builder
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.msg = action.payload.message || "OTP resent";
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
