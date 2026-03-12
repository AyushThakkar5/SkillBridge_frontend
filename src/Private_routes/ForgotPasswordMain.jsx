import axios from "axios";
import { useState } from "react";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPasswordMain() {
  const navigate = useNavigate();
  const reduxEmail = useSelector((state) => state.auth.email); // Fixed: was state.registration.email

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const getNewPasswordError = () => {
    if (!touched.newPassword || newPassword === "") return "";
    if (!validatePassword(newPassword)) {
      return "Password must be 8+ chars with uppercase, lowercase, number & special char";
    }
    return "";
  };

  const getConfirmPasswordError = () => {
    if (!touched.confirmPassword || confirmPassword === "") return "";
    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    if (field === "newPassword") {
      setNewPassword(value);
      setTouched({ ...touched, newPassword: true });
    } else {
      setConfirmPassword(value);
      setTouched({ ...touched, confirmPassword: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPasswordError = getNewPasswordError();
    const confirmPasswordError = getConfirmPasswordError();

    if (newPasswordError || confirmPasswordError) {
      toast.error(newPasswordError || confirmPasswordError);
      return;
    }

    if (!reduxEmail) {
      toast.error(
        "Email not found. Please start the password reset process again.",
      );
      navigate("/forgot-password-email");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/forgot-password/set-password",
        {
          email: reduxEmail,
          newPassword: newPassword,
        },
      );

      toast.success(
        "Password reset successfully! You can now login with your new password.",
      );
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Button only visible/enabled when BOTH fields are valid
  const isFormValid =
    newPassword &&
    confirmPassword &&
    !getNewPasswordError() &&
    !getConfirmPasswordError();

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)] bg-[#f3f4f6]">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-xl p-6 sm:p-10 border border-slate-100 text-center pb-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Reset Password
          </h2>
          <div className="w-12 h-12 bg-blue-50 text-[#0a66c2] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
            <FiShield />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div className="relative text-left">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-0.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className={`w-full border-b-2 py-1.5 outline-none transition-all bg-transparent px-1 pr-8 text-slate-700 text-sm ${
                  touched.newPassword && getNewPasswordError()
                    ? "border-red-500"
                    : "border-slate-200 focus:border-[#0a66c2]"
                }`}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-xs p-1"
              >
                {showNewPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            {touched.newPassword && getNewPasswordError() && (
              <p className="text-[9px] text-red-500 font-semibold mt-0.5">
                {getNewPasswordError()}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative text-left">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-0.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`w-full border-b-2 py-1.5 outline-none transition-all bg-transparent px-1 pr-8 text-slate-700 text-sm ${
                  touched.confirmPassword && getConfirmPasswordError()
                    ? "border-red-500"
                    : "border-slate-200 focus:border-[#0a66c2]"
                }`}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-xs p-1"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={14} />
                ) : (
                  <FiEye size={14} />
                )}
              </button>
            </div>
            {touched.confirmPassword && getConfirmPasswordError() && (
              <p className="text-[9px] text-red-500 font-semibold mt-0.5">
                {getConfirmPasswordError()}
              </p>
            )}
          </div>

          {/* Button only shows when form is valid */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full h-10 rounded-lg text-white font-bold transition-all shadow-md ${
              !isFormValid || loading
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-[#0a66c2] hover:bg-[#084d91]"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-3 pt-3 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-xs">
            Back to login?{" "}
            <Link
              to="/login"
              className="text-[#0a66c2] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordMain;
