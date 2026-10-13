import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Get logged-in user's appointments
export const getMyAppointments = createAsyncThunk(
  "appointments/getMyAppointments",
  async (year = "", { rejectWithValue }) => {
    try {
      const url = year
        ? `/appointments?year=${year}`
        : "/appointments";

      const response = await api.get(url);

      return response.data.appointments;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch appointments"
      );
    }
  }
);

// Cancel appointment
export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/appointments/${appointmentId}/cancel`
      );

      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to cancel appointment"
      );
    }
  }
);

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointments",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==============================
      // GET APPOINTMENTS
      // ==============================

      .addCase(getMyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
      })

      .addCase(getMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==============================
      // CANCEL APPOINTMENT
      // ==============================

      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const index = state.appointments.findIndex(
          (appointment) =>
            appointment._id === action.payload._id
        );

        if (index !== -1) {
          state.appointments[index] = {
            ...state.appointments[index],
            ...action.payload,
          };
        }
      })

      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;