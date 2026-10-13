import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import serviceReducer from "./slices/serviceSlice"
import appointmentReducer from "./slices/appointmentSlice";
import doctorReducer from "./slices/doctorSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    services: serviceReducer,
    appointments: appointmentReducer,
    doctor:doctorReducer,
  },
});