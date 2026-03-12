import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Image from "../assets/Mail.png";
import { emailauthentication } from "../Redux/authSlice";
import { setRegistrationData } from "../Redux/registrationSlice";

function RegistrationEmail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxEmail = useSelector((state) => state.registration.email);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleNext = async (e) => {
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
      // console.log("Sending email verification to:", email);

      const response = await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/users/register/send-email",
        { email: email.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        },
      );

      console.log("✅ Email API Success:", response.data);

      dispatch(
        setRegistrationData({
          email: email.trim(),
        }),
      );

      dispatch(emailauthentication("email_verified"));

      toast.success("Code sent! Check your inbox (and spam folder).");
      navigate("/verify-email");
    } catch (error) {
      console.error("Email API Error:", error.response?.data || error.message);

      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Invalid email format");
      } else if (error.response?.status === 409) {
        toast.error("This email is already registered. Please login.");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Failed to send verification code. Please try again.");
      }
    } finally {
      setLoading(false);
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
            Join SkillBridge
          </h1>

          <form onSubmit={handleNext} className="space-y-6">
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
                placeholder="Your email"
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
              {loading ? "Sending..." : "Continue with Email"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0a66c2] font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationEmail;
