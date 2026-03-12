import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
  token: null,
  email : null,
  password : null,
  role : null,
  isAuthenticated: false,
  employerAuth : false,
  dashboardData: null,
  logAuth : false,
  emailAuth:false,
  verifyAuth:false, 
  forgotAuth:false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {

      if(action.payload.res === "successful_candidate")
        { 
        state.isAuthenticated = true;
        state.logAuth = true;
        state.token = action.payload.token; 
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.role = action.payload.role;
      }
      else if(action.payload.res === "successful_employer")
      {
        state.employerAuth = true;
        state.logAuth = true;
        state.token = action.payload.token; 
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.role = action.payload.role;   
      }
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.dashboardData = null;
      state.employerAuth = false;
      state.logAuth = false;
      state.verifyAuth = false; 
      state.emailAuth = false;
      state.token = null;
    },
    emailauthentication: (state, action) => {
      if(action.payload === "email_verified"){
        state.emailAuth = true;
      }
    },
    verifyauthentication : (state, action) => {
      if(action.payload === "Verification successful"){
        state.verifyAuth = true;
      }
    },
    forgotauthentication : (state,action) => {
      if(action.payload.status === "email_verified")
      {
        state.forgotAuth = true;
        state.email=action.payload.email;
      }
    }
  }
});

export const { loginSuccess, setDashboardData, logout, emailauthentication, verifyauthentication, forgotauthentication } = authSlice.actions;
export default authSlice.reducer;
