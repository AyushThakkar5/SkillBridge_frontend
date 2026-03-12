import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  full_name: "",
  email: "",
  password: "",
  phone: "",
  role: "candidate",
  linkedin_url: "",
  resume: "", 
  github_url: "",
  company_name: "",
  company_description: "",
  skills: [],
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setRegistrationData: (state, action) => {
      return { ...state, ...action.payload };
    },
    setVerificationCode: (state, action) => {
  state.verificationCode = action.payload;
},

    clearRegistrationData: () => initialState,
  },
});


export const { setRegistrationData, clearRegistrationData, setVerificationCode } = registrationSlice.actions;
export default registrationSlice.reducer;
