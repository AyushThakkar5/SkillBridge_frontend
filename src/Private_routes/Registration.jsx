import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRegistrationData } from "../Redux/registrationSlice";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";

function Registration() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const reduxEmail = useSelector((state) => state.registration.email);
  const reduxResumeUrl = useSelector((state) => state.registration.resume);
  const reduxPublicId = useSelector((state) => state.registration.public_id);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileno: "",
    role: "Candidate",
    linkedin_url: "",
    companyName: "",
    companyDescription: "",
    resumeFile: null,
    resumeUrl: "",
    public_id: "",
    githubUrl: "",
  });

  const [skill,setSkill] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasResumeError, setHasResumeError] = useState(false);
  const fileInputRef = useRef(null);

  const validateField = useCallback((name, value, role) => {
    let fieldError = "";

    const patterns = {
      name: /^[a-zA-Z\s]{3,30}$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]\.[a-zA-Z]{2,}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      phone: /^[6-9]\d{9}$/,
      url: /^(https?:\/\/)?([\da-z.-]+)\.[a-z.]{2,6}(\/[\w .-]*)*\/?$/,
      linkedin_url: /.+/,
    };

    switch (name) {

      case "name":
        if (!value.trim()) fieldError = "Please enter your name for registration.";
        else if (!patterns.name.test(value)) fieldError = "Name must be 3-30 letters only.";
        break;

      case "email":
        if (!value.trim()) fieldError = "Email is required.";
        break;

      case "password":
        if (!value.trim()) fieldError = "Please enter your password.";
        else if (!patterns.password.test(value)) fieldError = "8+ chars, Upper, Lower, Number & Special required.";
        break;

      case "confirmPassword":
        if (!value.trim()) fieldError = "Please confirm your password.";
        else if (formData.password !== value) fieldError = "Passwords do not match.";
        break;

      case "mobileno":
        if (!value.trim()) fieldError = "Please enter your mobile number.";
        else if (!patterns.phone.test(value)) fieldError = "Enter valid 10-digit Indian mobile number.";
        break;
        
      case "linkedin_url":
        if (!value.trim()) fieldError = "LinkedIn URL is required.";
        break;

      case "githubUrl":
        if (!value?.trim()) fieldError = "Please enter your GitHub URL.";
        else if (!patterns.url.test(value)) fieldError = "Enter valid GitHub URL.";
        break;

      case "companyName":
        if (role === "Employer" && !value.trim()) fieldError = "Please enter company name.";
        break;

      case "companyDescription":
        if (role === "Employer" && !value.trim()) fieldError = "Please enter company description.";
        break;

      default:
        break;
    }

    return fieldError;
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(setRegistrationData({ [name]: value }));
    
    setFormData({ ...formData, [name]: value });

    const fieldError = validateField(name, value, formData.role);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));

    if (!fieldError && errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({ ...prev, role: newRole }));

    dispatch(setRegistrationData({ role: newRole.toLowerCase() }));
    
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newRole === "Candidate") {
        delete newErrors.companyName;
        delete newErrors.companyDescription;
      } else {
        delete newErrors.githubUrl;
        delete newErrors.resumeFile;
      }
      return newErrors;
    });
  };

  useEffect(() => {
    if (reduxEmail && formData.email !== reduxEmail) {
      setFormData((prev) => ({ ...prev, email: reduxEmail }));
    }
    
    if (reduxResumeUrl && reduxPublicId && !formData.resumeUrl) {
      setFormData((prev) => ({
        ...prev,
        resumeUrl: reduxResumeUrl,
        public_id: reduxPublicId,
      }));

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.resumeFile;
        return newErrors;
      });
      setHasResumeError(false);
    }
  }, [reduxEmail, reduxResumeUrl, reduxPublicId]);

  useEffect(() => {
    if (formData.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword, formData.role);
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: confirmError,
      }));
    }
  }, [formData.password, formData.confirmPassword, validateField]);

  const handleFileChange = async (e) => {

    console.log("Files selected:", e.target.files);
  const file = e.target.files?.[0];
  console.log("File:", file);
  if (!file) {
    console.log("No file selected");
    return;
  }

  if (file.type !== "application/pdf") {
    toast.error("Only PDF files are allowed!");
    e.target.value = '';
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error("File must be less than 10MB!");
    e.target.value = ''; 
    return;
  }

  try {
    setResumeUploading(true);
  
  const uploadFormData = new FormData();
  uploadFormData.append('resume', file);
  const skillsFormData = new FormData();
  skillsFormData.append('resume', file);

  const [uploadResponse, skillResponse] = await Promise.all([
    axios.post("https://skillbridge-backend-3-vqsm.onrender.com/api/users/register/upload-resume", uploadFormData),
    axios.post("https://janmejay.pythonanywhere.com/extract-skills", skillsFormData)
  ]);

  const extractedSkills = skillResponse.data.skills;
  setSkill(extractedSkills);

  console.log("Upload:", uploadResponse.data);
  console.log("Skills:", extractedSkills);

    if (!uploadResponse.data) {
      throw new Error("Resume upload failed");
    }

    const resumeUrl = uploadResponse.data.resume_url;
    const publicId = uploadResponse.data.public_id;

    setFormData((prev) => ({
      ...prev,
      resumeFile: file,
      resumeUrl: resumeUrl,
      public_id: publicId,
    }));

    dispatch(
      setRegistrationData({
        resume: resumeUrl,
        public_id: publicId,
        skills: extractedSkills,
      })
    );

    toast.success("Resume uploaded successfully!");
  } catch (error) {

     if (error.response?.status === 400 || error.response?.status === 422) {
      toast.error("Skills extraction failed. Please try another resume.");
    } else {
      toast.error("Resume upload failed. Please try again.");
    }
    
    console.error("Resume error:", error);
    console.log("upload error response:", error.response);
    toast.error("Resume upload or skill extraction failed.");
  } finally {
    setResumeUploading(false);
  }
};

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData((prev) => ({
      ...prev,
      resumeFile: null,
      resumeUrl: "",
      public_id: "",
    }));
    dispatch(
      setRegistrationData({
        resume: "",
        public_id: "",
      })
    );
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.resumeFile;
      return newErrors;
    });
    setHasResumeError(false);
    toast.info("🗑️ Resume cleared successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleChooseFileClick = () => {
  if (!resumeUploading && fileInputRef.current) {
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  }
};


  const validateForm = () => {
    let newErrors = {};

    const patterns = {
      name: /^[a-zA-Z\s]{3,30}$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]\.[a-zA-Z]{2,}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      phone: /^[6-9]\d{9}$/,
      url: /^(https?:\/\/)?([\da-z.-]+)\.[a-z.]{2,6}(\/[\w .-]*)*\/?$/,
      linkedin_url: /.+/,
    };

    if (!formData.name.trim())
      newErrors.name = "Please enter your name for registration.";
    else if (!patterns.name.test(formData.name))
      newErrors.name = "Name must be 3-30 letters only.";

    if (!formData.email.trim() && !reduxEmail)
      newErrors.email = "Email is required.";

    if (!formData.password.trim())
      newErrors.password = "Please enter your password.";
    else if (!patterns.password.test(formData.password))
      newErrors.password = "8+ chars, Upper, Lower, Number & Special required.";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (!formData.mobileno.trim())
      newErrors.mobileno = "Please enter your mobile number.";
    else if (!patterns.phone.test(formData.mobileno))
      newErrors.mobileno = "Enter valid 10-digit Indian mobile number.";

    if (!formData.linkedin_url.trim())
  newErrors.linkedin_url = "LinkedIn URL is required.";

    if (formData.role === "Candidate") {
      if (!formData.githubUrl?.trim())
        newErrors.githubUrl = "Please enter your GitHub URL.";
      else if (!patterns.url.test(formData.githubUrl))
        newErrors.githubUrl = "Enter valid GitHub URL.";

      if (!formData.resumeUrl || resumeUploading) {
        newErrors.resumeFile = resumeUploading 
          ? "Resume upload in progress..." 
          : "Please upload your resume for registration.";
      }
    } else {
      if (!formData.companyName.trim())
        newErrors.companyName = "Please enter company name.";

      if (!formData.companyDescription.trim())
        newErrors.companyDescription = "Please enter company description.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please fix all errors before proceeding.");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.mobileno,
      linkedin_url: formData.linkedin_url || "",
      role: formData.role.toLowerCase(),
      ...(formData.role === "Candidate")
        ? {
            resume_url: formData.resumeUrl,
            public_id: formData.public_id,
            github_url: formData.githubUrl,
            skills: skill || [],
          }
        : {
            company_name: formData.companyName,
            company_description: formData.companyDescription,
          },
    };

    console.log("Registration response:", payload);
    const response = await axios.post(
      "https://skillbridge-backend-3-vqsm.onrender.com/api/users/register/complete",
      payload
    );

    if (response.data && (response.data.success || response.status === 200 || response.status === 201)) 
      {
        console.log("🎉 Registration API Success:", response.data);
      dispatch(setRegistrationData({
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.mobileno,
        linkedin_url: formData.linkedin_url || "",
        role: formData.role.toLowerCase(),
        ...(formData.role === "Candidate")
          ? {
              resume: formData.resumeUrl,
              public_id: formData.public_id,
              github_url: formData.githubUrl,
              skills : [],
            }
          : {
              company_name: formData.companyName,
              company_description: formData.companyDescription,
            },
      }));

      toast.success("🎉 Registration completed successfully!");
      console.log("🎉 SUCCESS - About to navigate:", { 
  response: response.data, 
  payloadSent: payload 
});
      navigate("/login"); 
      
    }
  }
    catch (error) {
    const status = error.response?.status;
    const apiMsg = error.response?.data?.error || error.response?.data?.message || "Registration failed.";

    if (status === 409) {
      toast.warning("This email is already registered. Please sign in.");
      setErrors({ email: "Email already in use." });
    } else {
      toast.error(`${apiMsg}`);
    }
    console.error("Registration error:", error);
  } finally {
    setLoading(false);
  }
};


  const isFormComplete = () => {
    const commonFields = 
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.mobileno.trim() &&
      formData.linkedin_url.trim() &&
      formData.password === formData.confirmPassword;

    if (formData.role === "Candidate") {
      return commonFields &&
        formData.githubUrl?.trim() &&
        formData.resumeUrl && 
        !resumeUploading
    } else {
      return commonFields &&
        formData.companyName.trim() &&
        formData.companyDescription.trim();
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-100">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Join SkillBridge
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Complete your registration
            </p>
          </div>

          <div className="flex justify-center gap-1 sm:gap-2 mb-6 sm:mb-8 p-1 bg-slate-100 rounded-lg sm:rounded-xl">
            {["Candidate", "Employer"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-md sm:rounded-lg transition-all duration-800 capitalize ${
                  formData.role === r
                    ? "bg-white text-[#0a66c2] shadow-sm"
                    : "text-slate-400 hover:text-slate-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
            {/* Row 1: Name + Email (read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative pb-3 sm:pb-4">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 text-slate-700 text-sm sm:text-base ${
                    errors.name ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="relative pb-3 sm:pb-4">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  readOnly
                  className="w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-slate-50 border-slate-200 text-slate-700 text-sm sm:text-base px-1 cursor-not-allowed"
                  placeholder="Email from verification"
                />
                {errors.email && (
                  <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Password + Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative pb-3 sm:pb-4">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 pr-8 sm:pr-10 text-slate-700 text-sm sm:text-base ${
                      errors.password ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
                    }`}
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-sm"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="relative pb-3 sm:pb-4">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 pr-8 sm:pr-10 text-slate-700 text-sm sm:text-base ${
                      errors.confirmPassword ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-sm"
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
  {/* Mobile Number */}
  <div className="relative pb-3 sm:pb-4">
    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
      Mobile Number
    </label>
    <input
      type="tel"
      name="mobileno"
      value={formData.mobileno}
      onChange={handleChange}
      className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 text-slate-700 text-sm sm:text-base ${
        errors.mobileno ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
      }`}
      placeholder="10-digit mobile number"
    />
    {errors.mobileno && (
      <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
        {errors.mobileno}
      </p>
    )}
  </div>

  {/* LinkedIn URL */}
  <div className="relative pb-3 sm:pb-4">
    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
      LinkedIn URL
    </label>
    <input
      type="url"
      name="linkedin_url"
      value={formData.linkedin_url}
      onChange={handleChange}
      className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 text-slate-700 text-sm sm:text-base ${
        errors.linkedin_url ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
      }`}
      placeholder="linkedin.com/company/yourcompany"
    />
    {errors.linkedin_url && (
      <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
        {errors.linkedin_url}
      </p>
    )}
  </div>
</div>

           {formData.role === "Candidate" && (
  <>
    {/* Row 3: GitHub URL (single column) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* GitHub URL */}
      <div className="relative pb-3 sm:pb-4">
        <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
          GitHub URL
        </label>
        <input
          type="url"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 text-slate-700 text-sm sm:text-base ${
            errors.githubUrl ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
          }`}
          placeholder="github.com/yourusername"
        />
        {errors.githubUrl && (
          <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
            {errors.githubUrl}
          </p>
        )}
      </div>
    </div>

      {/* Resume Upload - Single Line Field */}
      <div className="relative pb-3 sm:pb-4">
        <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
          Resume (PDF only) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={resumeUploading}
            className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 text-slate-700 text-sm sm:text-base file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0a66c2] file:text-white hover:file:bg-[#084d91] cursor-pointer ${
              errors.resumeFile || resumeUploading 
                ? "border-red-500" 
                : "border-slate-200 focus:border-[#0a66c2]"
            }`}
          />
          {errors.resumeFile && !resumeUploading && (
            <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
              {errors.resumeFile}
            </p>
          )}
          {resumeUploading && (
            <p className="text-[9px] sm:text-[10px] text-blue-500 font-semibold absolute bottom-0">
              📤 Uploading...
            </p>
          )}
        </div>
      </div>


    {/* File Preview & Controls - Below the input field */}
    {formData.resumeFile && (
      <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 mt-2">
        <span className="flex-1 text-sm text-slate-700 font-medium truncate">
          ✅ {formData.resumeFile.name} ({(formData.resumeFile.size / 1024 / 1024).toFixed(1)}MB)
        </span>
        <button
          type="button"
          onClick={handleClearFile}
          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 flex-shrink-0"
          title="Clear file"
          disabled={resumeUploading}
        >
          <FiX size={18} />
        </button>
      </div>
    )}
  </>
)}


            {formData.role === "Employer" && (
              <>
                {/* Row 3: Company Name + LinkedIn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative pb-3 sm:pb-4">
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 text-slate-700 text-sm sm:text-base ${
                        errors.companyName ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
                      }`}
                      placeholder="Your company name"
                    />
                    {errors.companyName && (
                      <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                {/* Company Description */}
                <div className="relative pb-3 sm:pb-4">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1">
                    Company Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="companyDescription"
                    rows="2"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    className={`w-full border-b-2 py-2.5 sm:py-3 outline-none transition-all bg-transparent px-1 text-slate-700 text-sm sm:text-base resize-none ${
                      errors.companyDescription ? "border-red-500" : "border-slate-200 focus:border-[#0a66c2]"
                    }`}
                    placeholder="Tell us about your company..."
                  />
                  {errors.companyDescription && (
                    <p className="text-[9px] sm:text-[10px] text-red-500 font-semibold absolute bottom-0">
                      {errors.companyDescription}
                    </p>
                  )}
                </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || resumeUploading || !isFormComplete()}
              className={`w-full h-11 sm:h-12 rounded-xl text-white font-bold transition-all shadow-lg text-sm sm:text-base ${
                loading || resumeUploading || !isFormComplete()
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-[#0a66c2] hover:bg-[#084d91]"
              }`}
            >
              {loading
                ? "Processing Registration"
                : resumeUploading
                ? "Uploading Resume"
                : "Register"}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs sm:text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#0a66c2] font-bold hover:underline text-xs sm:text-sm"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
