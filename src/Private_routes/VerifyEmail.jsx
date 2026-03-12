import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiMail, FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyauthentication } from "../Redux/authSlice";
import { setRegistrationData } from "../Redux/registrationSlice";

function VerifyEmail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxEmail = useSelector((state) => state.registration.email);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!reduxEmail) navigate("/register-email", { replace: true });
  }, [reduxEmail, navigate]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      toast.warn("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/users/register/verify-code",
        JSON.stringify({
          email: reduxEmail,
          verificationCode: finalOtp,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      dispatch(setRegistrationData({ verificationCode: finalOtp }));
      dispatch(verifyauthentication("Verification successful"));
      // console.log("Verification successful:", response.data);

      toast.success("Email verified successfully!");

      setTimeout(() => {
        navigate("/registration", { replace: true });
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!reduxEmail) {
      toast.error("Email not found. Please register again.");
      return;
    }

    try {
      setResendLoading(true);

      await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/users/register/send-email",
        { email: reduxEmail },
      );

      toast.success("Verification code resent successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification code.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)] bg-[#f3f4f6]">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-5 sm:p-8 border border-slate-100 text-center">
        <div className="w-16 h-16 bg-blue-50 text-[#0a66c2] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          <FiMail />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
          Confirm your email
        </h2>

        <p className="text-slate-400 text-sm mb-8">
          Enter the 6-digit code sent to <br />
          <span className="text-slate-700 font-semibold">{reduxEmail}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((data, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                value={data}
                ref={(el) => (inputRefs.current[i] = el)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onChange={(e) => handleOtpChange(e.target, i)}
                className="w-full aspect-square border border-slate-200 rounded-xl text-center text-xl font-bold text-[#0a66c2] focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
              />
            ))}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl text-white font-bold transition-all shadow-md ${
                loading ? "bg-slate-300" : "bg-[#0a66c2] hover:bg-[#084d91]"
              }`}
            >
              {loading ? "Verifying..." : "Verify Identity"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="flex items-center justify-center gap-2 mx-auto text-sm font-semibold text-[#0a66c2] hover:text-[#084d91] transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={resendLoading ? "animate-spin" : ""} />
              {resendLoading ? "Resending..." : "Resend verification code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
