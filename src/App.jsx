import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordEmail from "./components/ForgotPasswordEmail";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import RegistrationEmail from "./components/RegistrationEmail";
import Candidate_Dashboard from "./Private_routes/Candidate/Candidate_Dashboard";
import CandidateProfile from "./Private_routes/Candidate/CandidateProfile";
import ViewApplied from "./Private_routes/Candidate/ViewApplied";
import ViewAppliedDetails from "./Private_routes/Candidate/ViewAppliedDetails";
import ViewMatched from "./Private_routes/Candidate/ViewMatched";
import ViewMatchedDetails from "./Private_routes/Candidate/ViewMatchedDetails";
import ViewResponse from "./Private_routes/Candidate/ViewResponse";
import ViewResponseDetails from "./Private_routes/Candidate/ViewResponseDetails";

import UpdatedDetails from "./Private_routes/Employer/UpdatedDetails";
import EmployerApplicationDetail from "./Private_routes/Employer/EmployerApplicationDetail";
import EmployerApplications from "./Private_routes/Employer/EmployerApplications";
import EmployerDashboard from "./Private_routes/Employer/EmployerDashboard";
import EmployerJobs from "./Private_routes/Employer/EmployerJobs";
import EmployerProtected from "./Private_routes/EmployerProtected";
import ForgotPasswordMain from "./Private_routes/ForgotPasswordMain";
import ForgotPasswordOTP from "./Private_routes/ForgotPasswordOTP";
import ForgotProtected from "./Private_routes/ForgotProtected";
import ProtectedRoute from "./Private_routes/ProtectedRoute";
import RegisterProtected from "./Private_routes/RegisterProtected";
import Registration from "./Private_routes/Registration";
import VerifyEmail from "./Private_routes/VerifyEmail";
import VerifyProtected from "./Private_routes/VerifyProtected";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen w-full bg-[#f3f4f6] pt-14 sm:pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/forgot-password-email"
            element={<ForgotPasswordEmail />}
          />
          <Route
            path="/forgot-password-otp"
            element={
              <ForgotProtected>
                <ForgotPasswordOTP />
              </ForgotProtected>
            }
          />
          <Route
            path="/forgot-password-main"
            element={
              <ForgotProtected>
                <ForgotPasswordMain />
              </ForgotProtected>
            }
          />
          <Route path="/register-email" element={<RegistrationEmail />} />
          <Route
            path="/verify-email"
            element={
              <VerifyProtected>
                <VerifyEmail />
              </VerifyProtected>
            }
          />
          <Route
            path="/registration"
            element={
              <RegisterProtected>
                <Registration />
              </RegisterProtected>
            }
          />
          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute>
                <Candidate_Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewapplied"
            element={
              <ProtectedRoute>
                <ViewApplied />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewapplied-details"
            element={
              <ProtectedRoute>
                <ViewAppliedDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewresponse-details"
            element={
              <ProtectedRoute>
                <ViewResponseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="viewmatched"
            element={
              <ProtectedRoute>
                <ViewMatched />
              </ProtectedRoute>
            }
          />
          <Route
            path="viewresponse"
            element={
              <ProtectedRoute>
                <ViewResponse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updated-details/:id"
            element={
              <EmployerProtected>
                <UpdatedDetails />
              </EmployerProtected>
            }
          />
          <Route
            path="/candidate-profile"
            element={
              <ProtectedRoute>
                <CandidateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewmatched-details"
            element={
              <ProtectedRoute>
                <ViewMatchedDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-dashboard"
            element={
              <EmployerProtected>
                <EmployerDashboard />
              </EmployerProtected>
            }
          />
          <Route
            path="/employer-jobs"
            element={
              <EmployerProtected>
                <EmployerJobs />
              </EmployerProtected>
            }
          />
          <Route
            path="/employer-applications/:jobId"
            element={
              <EmployerProtected>
                <EmployerApplications />
              </EmployerProtected>
            }
          />
          <Route
            path="//employer/applications/:applicationId"
            element={
              <EmployerProtected>
                <EmployerApplicationDetail />
              </EmployerProtected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    </Router>
  );
}

export default App;