import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Get logged-in user's profile
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/profile");

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch profile"
      );
    }
  }
);

// Update profile details
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put(
        "/users/profile",
        profileData
      );

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    }
  }
);

// Upload profile picture
export const uploadProfileImage = createAsyncThunk(
  "profile/uploadProfileImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("profileImage", imageFile);

      const response = await api.post(
        "/users/profile/image",
        formData
      );

      return response.data.profileImage;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to upload profile picture"
      );
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  updating: false,
  uploading: false,
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    clearProfileMessages: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // GET PROFILE
      // =========================
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch profile";
      })

      // =========================
      // UPDATE PROFILE
      // =========================
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error =
          action.payload || "Failed to update profile";
        state.success = false;
      })

      // =========================
      // UPLOAD PROFILE IMAGE
      // =========================
      .addCase(uploadProfileImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })

      .addCase(
        uploadProfileImage.fulfilled,
        (state, action) => {
          state.uploading = false;
          state.error = null;

          if (state.user) {
            state.user.profileImage = action.payload;
          }
        }
      )

      .addCase(
        uploadProfileImage.rejected,
        (state, action) => {
          state.uploading = false;
          state.error =
            action.payload ||
            "Failed to upload profile picture";
        }
      );
  },
});

export const { clearProfileMessages } =
  profileSlice.actions;

export default profileSlice.reducer;