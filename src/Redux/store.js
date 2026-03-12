import { configureStore } from "@reduxjs/toolkit";
import Auth from "./authSlice";
import Registration from "./registrationSlice";
import empDash from "./empDashSlice";
import candDash from "./candDashSlice";

export const store = configureStore({
  reducer: {
    auth: Auth,
    registration: Registration,
    empDash: empDash,
    candDash:candDash,
  },
});