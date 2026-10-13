import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";


// ==========================
// REGISTER
// ==========================

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);


// ==========================
// LOGIN
// ==========================

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userData);

      const { token, user } = response.data;

      // Store JWT
      localStorage.setItem("token", token);

      return {
        token,
        user,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");

      return response.data.user;
    } catch (error) {
      localStorage.removeItem("token");

      return rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

// ==============
// ============
// INITIAL STATE
// ==========================

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  success: false,
};


// ==========================
// SLICE
// ==========================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
  logout: (state) => {
    state.user = null;
    state.token = null;
    state.success = false;
    localStorage.removeItem("token");
  },

  clearAuthMessages: (state) => {
    state.error = null;
    state.success = false;
  },

  updateProfileImage: (state, action) => {
    if (state.user) {
      state.user.profileImage = action.payload;
    }
  },
},

  updateProfileImage: (state, action) => {
  if (state.user) {
    state.user.profileImage = action.payload;
  }
},

  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });


    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
   // GET CURRENT USER
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })

      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
},  

});

export const {
  logout,
  clearAuthMessages,
  updateProfileImage,
} = authSlice.actions;

export default authSlice.reducer;