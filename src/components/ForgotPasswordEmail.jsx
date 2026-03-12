import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Image from "../assets/Mail.png";
import { forgotauthentication } from "../Redux/authSlice";

function ForgotPasswordEmail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/forgot-password/send-email",
        {
          email: email,
        },
      );

      dispatch(
        forgotauthentication({
          status: "email_verified",
          email: email,
        }),
      );
      toast.success(
        "Reset password OTP sent! Check your inbox (and spam folder).",
      );
      console.log(response);

      setLoading(false);
      navigate("/forgot-password-otp");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-2xl shadow-xl bg-white border border-slate-200 overflow-hidden">
        {/* LEFT IMAGE SECTION */}
        <div className="lg:w-1/2 flex items-center justify-center p-10 bg-white">
          <img src={Image} alt="Mail" className="w-64 h-64 object-contain" />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="lg:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-8">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#0a66c2] transition-all duration-200 ${
                  emailError ? "border-red-400 bg-red-50" : ""
                }`}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                loading || !email.trim() || emailError || !validateEmail(email)
              }
              className="w-full bg-[#0a66c2] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#084d91] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center mt-6 text-sm text-slate-500">
            Remember your password?{" "}
            <Link to="/login" className="text-[#0a66c2] font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordEmail;
