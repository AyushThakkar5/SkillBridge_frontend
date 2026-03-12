import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiMail, FiRefreshCw } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPasswordOTP() {
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.email);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password-email");
    }
  }, [email, navigate]);

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
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/forgot-password/verify-code",
        {
          email: email,
          verificationCode: finalOtp,
        },
      );

      toast.success("Password reset code verified successfully!", {
        toastId: "otp-success",
      });

      setTimeout(() => {
        navigate("/forgot-password-main");
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);

    try {
      await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/forgot-password/send-email",
        {
          email: email,
        },
      );

      toast.success("Verification code resent successfully!", {
        toastId: "resend-success",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-slate-100 my-auto text-center">
        <div className="w-16 h-16 bg-blue-50 text-[#0a66c2] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          <FiMail />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
          Reset your password
        </h2>

        <p className="text-slate-400 text-sm mb-8">
          Enter the 6-digit code sent to <br />
          <span className="text-slate-700 font-semibold">
            {email || "your email"}
          </span>
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
              {loading ? "Verifying..." : "Verify Reset Code"}
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

export default ForgotPasswordOTP;
