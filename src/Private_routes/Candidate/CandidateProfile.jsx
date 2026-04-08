import axios from "axios";
import { useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiLock,
  FiTrendingUp,
  FiUploadCloud,
} from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const CandidateProfile = () => {
  const navigate = useNavigate();

  // 1. Fetching Data from Redux Slices
  const token = useSelector((state) => state.auth.token);

  // Construct loginPayload to match the structure expected by your backend
  const authData = useSelector((state) => state.auth);
  const loginPayload = {
    email: authData.email?.trim(),
    password: authData.password,
    role: authData.role?.toLowerCase(),
  };

  // Fetch candidate details from candDash slice
  const { full_name, candidate_id } = useSelector((state) => state.candDash);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);

  // Password State
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // File Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFileName, setPreviewFileName] = useState("");
  const [previewFileSize, setPreviewFileSize] = useState("");
  const [fileError, setFileError] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validatePasswordField = (field, value) => {
    let error = "";
    if (!value) {
      error = "This field is required";
    } else if (field === "newPassword") {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
      if (!regex.test(value)) {
        error = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol";
      }
    } else if (field === "confirmPassword") {
      if (value !== newPassword) error = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const isCurrentValid = validatePasswordField(
      "currentPassword",
      currentPassword,
    );
    const isNewValid = validatePasswordField("newPassword", newPassword);
    const isConfirmValid = validatePasswordField(
      "confirmPassword",
      confirmPassword,
    );

    if (isCurrentValid && isNewValid && isConfirmValid) {
      try {
        await axios.post(
          `https://skillbridge-backend-3-vqsm.onrender.com/api/forgot-password/candidate/change-password`,
          {
            oldPassword: currentPassword,
            newPassword: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              user: JSON.stringify(loginPayload),
            },
          },
        );

        toast.success("Password updated successfully!");
        setPasswordEdit(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update password";
        toast.error(message);
      }
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (file) {
      setIsUploaded(false);
      setIsExtracting(true);

      try {
        const skillsFormData = new FormData();
        skillsFormData.append("resume", file);

        const response = await axios.post(
          "https://janmejay.pythonanywhere.com/extract-skills",
          skillsFormData,
        );

        setExtractedSkills(response.data.skills || []);

        // Preview setup
        setPreviewFile(URL.createObjectURL(file));
        setResumeFile(file);
        setPreviewFileName(file.name);
        setPreviewFileSize((file.size / (1024 * 1024)).toFixed(2));

        //  Single success toast
        toast.success("Resume analyzed successfully!");
      } catch (error) {
        console.error(error);

        // Even if extraction fails, allow preview
        setPreviewFile(URL.createObjectURL(file));
        setResumeFile(file);

        // Single error toast
        toast.error(
          "Skill extraction failed. You can still preview the resume.",
        );
      } finally {
        setIsExtracting(false);
        e.target.value = null;
      }
    }
  };

  const handlePreviewCancel = () => {
    setPreviewFile(null);
    setPreviewFileName("");
    setPreviewFileSize("");
  };

  const handlePreviewOk = async () => {
    if (!resumeFile) return;

    try {
      // -------- 1. Prepare FormData --------
      const finalFormData = new FormData();
      finalFormData.append("resume", resumeFile);
      finalFormData.append("candidate_id", candidate_id);
      finalFormData.append("skills", JSON.stringify(extractedSkills));

      // -------- 2. First API (Update Resume) --------
      await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/forgot-password/candidate/replace-resume",
        finalFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );

      // -------- 3. Second API (Rematch Candidate) --------
      await axios.post(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/match/rematch-candidate",
        { candidate_id }, // FIX: send as object, not raw value
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );

      // -------- 4. Update UI --------
      setIsUploaded(true);
      setPreviewFile(null);

      // -------- 5. Single Success Toast --------
      toast.success("Resume updated and rematched successfully!");
    } catch (error) {
      console.error(error);

      // -------- 6. Single Error Toast --------
      toast.error("Failed to update resume. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your resume and account security
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {full_name ? full_name.charAt(0).toUpperCase() : "C"}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 pr-2">
              {full_name || "Candidate"}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Resume Management */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <FiFileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Resume Management
                </h2>
              </div>

              {!previewFile && !resumeFile && (
                <div className="w-full">
                  <label className="relative border-2 border-dashed border-gray-300 rounded-xl p-10 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer block w-full">
                    {/* Inside the file upload label */}
                    <input
                      type="file"
                      onChange={handleResumeChange}
                      className="hidden"
                      accept=".pdf"
                      disabled={isExtracting} // Prevent double uploads
                    />
                    <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FiUploadCloud className="w-6 h-6" />
                    </div>
                    {isExtracting ? (
                      <p className="text-blue-600 font-medium animate-pulse">
                        Extracting Skills...
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-gray-700">
                        Click or drag file to upload
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      PDF format, max size 10MB
                    </p>
                  </label>
                  {fileError && (
                    <p className="text-red-500 text-sm mt-3 text-center font-medium bg-red-50 py-2 rounded-lg">
                      {fileError}
                    </p>
                  )}
                </div>
              )}

              {/* PDF Preview Area */}
              {previewFile && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Selected File Preview
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch">
                    <div className="w-20 h-28 overflow-hidden rounded-lg shadow-sm border border-gray-300 bg-white flex-shrink-0 relative pointer-events-none">
                      <Document file={previewFile}>
                        <Page
                          pageNumber={1}
                          width={80}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                    <div className="flex flex-col justify-between flex-1 w-full text-center sm:text-left">
                      <div>
                        <h4 className="font-medium text-gray-900 truncate max-w-[300px]">
                          {previewFileName}
                        </h4>
                        <p className="text-sm text-gray-500 mt-0.5">
                          PDF • {previewFileSize} MB
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 sm:mt-0 justify-center sm:justify-start">
                        <button
                          onClick={handlePreviewCancel}
                          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlePreviewOk}
                          disabled={isExtracting} // Disable during API call
                          className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                            isExtracting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isExtracting ? (
                            "Processing..."
                          ) : (
                            <>
                              <FiCheck className="w-4 h-4" /> Confirm Upload
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {resumeFile && !previewFile && (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <FiCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Resume Uploaded
                      </p>
                      <p className="text-xs text-gray-600">{resumeFile.name}</p>
                    </div>
                  </div>

                  {/* Only show Remove if the file hasn't been confirmed/uploaded yet */}
                  {!isUploaded && (
                    <button
                      onClick={() => setResumeFile(null)}
                      className="text-sm text-red-600 font-medium hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              <div className="mt-auto pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-4 py-8 flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm shrink-0 border border-blue-50">
                    <FiTrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      New skills acquired?
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Keep your resume updated to get the most accurate and
                      relevant job matches for your career growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Security / Password */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 rounded-xl">
                    <FiLock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Security
                  </h2>
                </div>
                {!passwordEdit && (
                  <button
                    onClick={() => setPasswordEdit(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" /> Update Password
                  </button>
                )}
              </div>

              {passwordEdit ? (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  {[
                    {
                      id: "currentPassword",
                      label: "Current Password",
                      val: currentPassword,
                      setter: setCurrentPassword,
                    },
                    {
                      id: "newPassword",
                      label: "New Password",
                      val: newPassword,
                      setter: setNewPassword,
                    },
                    {
                      id: "confirmPassword",
                      label: "Confirm New Password",
                      val: confirmPassword,
                      setter: setConfirmPassword,
                    },
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword[field.id] ? "text" : "password"}
                          value={field.val}
                          onChange={(e) => {
                            field.setter(e.target.value);
                            validatePasswordField(field.id, e.target.value);
                          }}
                          className={`w-full p-2.5 pr-10 rounded-lg border ${
                            errors[field.id]
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-purple-100 focus:border-purple-500"
                          } outline-none transition-all text-sm`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              [field.id]: !prev[field.id],
                            }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword[field.id] ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>

                      {errors[field.id] && (
                        <p className="text-red-500 text-xs mt-1.5">
                          {errors[field.id]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPasswordEdit(false)}
                      className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      Update
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                    <span>
                      Ensure your account is using a strong password. Update it
                      regularly to stay secure.
                    </span>
                  </p>
                  <div className="mt-5 border-t border-gray-200 pt-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Steps to update:
                    </h4>
                    <ul className="space-y-3.5">
                      {[
                        "Click Update Password.",
                        "Enter current password.",
                        "Set a strong new password.",
                        "Confirm and Save.",
                      ].map((step, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;