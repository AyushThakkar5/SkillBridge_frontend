import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  full_name: null,
  email: null,
  phone: null,
  linkedin_url: null,
  resume: null,
  resume_public_id: null,
  github_url: null,
  skills: null,
  candidate_id : null,
};

const candDashSlice = createSlice({
  name: "candDash",
  initialState,
  reducers: {
    setCandidateData: (state, action) => {
      state.full_name = action.payload.data.full_name;
      state.email = action.payload.data.email;
      state.phone = action.payload.data.phone;
      state.linkedin_url = action.payload.data.linkedin_url;
      state.resume = action.payload.data.resume;
      state.resume_public_id = action.payload.data.resume_public_id;
      state.github_url = action.payload.data.github_url;
      state.skills = action.payload.data.skills;
      state.candidate_id = action.payload.data.candidate_id;
    },
  },
});

export const { setCandidateData } = candDashSlice.actions;
export default candDashSlice.reducer;
