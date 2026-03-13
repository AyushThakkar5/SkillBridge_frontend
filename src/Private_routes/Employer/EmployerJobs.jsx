import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import JobCard from "./JobCard";

// ================= POST JOB MODAL =================

const PostJobModal = ({ isOpen, onClose, onPost }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    job_type: "Full-time",
    location: "",
    salary_range: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    required_skills: "",
    location: "",
    salary_range: "",
  });

  const validateField = (name, value) => {
    let message = "";

    if (name === "title") {
      if (!value.trim()) {
        message = "Job title is required";
      } else if (value.trim().length < 3) {
        message = "Job title must be at least 3 characters";
      } else if (value.trim().length > 80) {
        message = "Title cannot exceed 80 characters";
      } else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim())) {
        message =
          "Each word must start with a capital letter (Example: Database Administrator)";
      }
    }

    if (name === "description") {
      if (!value.trim()) {
        message = "Job description is required";
      } else if (value.trim().length < 20) {
        message = "Description must be at least 20 characters";
      }
    }

    if (name === "required_skills") {
      if (!value.trim()) {
        message = "Please enter required skills";
      }
    }

    if (name === "location") {
      if (!value.trim()) {
        message = "Location is required";
      } else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim())) {
        message =
          "Each word must start with a capital letter (Example: New York)";
      }
    }

    if (name === "salary_range") {
      if (!value.trim()) {
        message = "Salary is required";
      } else if (formData.job_type === "Internship") {
        if (!/^\d{1,3}(,\d{3})+$/.test(value)) {
          message =
            "Enter stipend with comma format (Example: 8,000 or 15,000)";
        }
      } else {
        const hasHyphen = value.includes("-");
        const hasLPALower = /lpa$/i.test(value) && !/LPA$/.test(value);
        const spaceBeforeLPA = /\sLPA$/.test(value);
        const spaceAroundHyphen = /\s-\s/.test(value);

        // Case 1: LPA missing
        if (!/lpa$/i.test(value)) {
          message =
            "Please enter salary with LPA (Example: 4 LPA or 4 - 5 LPA)";
        }

        // Case 2: LPA not capital
        else if (hasLPALower) {
          message = "LPA must be written in capital letters";
        }

        // Case 3: BOTH spacing mistakes
        else if (hasHyphen && !spaceBeforeLPA && !spaceAroundHyphen) {
          message =
            "Enter salary with spaces around hyphen and before LPA like: 4 - 5 LPA";
        }

        // Case 4: Missing space before LPA
        else if (!spaceBeforeLPA) {
          message = "Please add space before LPA (Example: 5 LPA)";
        }

        // Case 5: Hyphen spacing issue
        else if (hasHyphen && !spaceAroundHyphen) {
          message = "Please add spaces around hyphen (Example: 4 - 5 LPA)";
        }

        // Case 6: Final format validation
        else if (
          !/^\d{1,2}(\.\d{1,2})?\sLPA$/.test(value) &&
          !/^\d{1,2}(\.\d{1,2})?\s-\s\d{1,2}(\.\d{1,2})?\sLPA$/.test(value)
        ) {
          message = "Enter salary like: 4 LPA or 4 - 5 LPA";
        }
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    Object.keys(formData).forEach((field) => {
      let value = formData[field];
      let message = "";

      if (field === "title") {
        if (!value.trim()) message = "Job title is required";
        else if (value.trim().length < 3)
          message = "Job title must be at least 3 characters";
        else if (value.trim().length > 80)
          message = "Title cannot exceed 80 characters";
        else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim())) {
          message =
            "Each word must start with a capital letter (Example: Database Administrator)";
        }
      }

      if (field === "description") {
        if (!value.trim()) message = "Job description is required";
        else if (value.trim().length < 20)
          message = "Description must be at least 20 characters";
      }

      if (field === "required_skills") {
        if (!value.trim()) message = "Please enter required skills";
      }

      if (field === "location") {
        if (!value.trim()) message = "Location is required";
        else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim()))
          message =
            "Each word must start with a capital letter (Example: New York)";
      }

      if (field === "salary_range") {
        if (!value.trim()) {
          message = "Salary is required";
        } else if (formData.job_type === "Internship") {
          if (!/^\d{1,3}(,\d{3})+$/.test(value)) {
            message =
              "Enter salary with comma format (Example: 8,000 or 15,000)";
          }
        } else {
          const hasHyphen = value.includes("-");
          const hasLPALower = /lpa$/i.test(value) && !/LPA$/.test(value);
          const spaceBeforeLPA = /\sLPA$/.test(value);
          const spaceAroundHyphen = /\s-\s/.test(value);

          // Case 1: LPA missing
          if (!/lpa$/i.test(value)) {
            message =
              "Please enter salary with LPA (Example: 4 LPA or 4 - 5 LPA)";
          }

          // Case 2: LPA not capital
          else if (hasLPALower) {
            message = "LPA must be written in capital letters";
          }

          // Case 3: BOTH spacing mistakes
          else if (hasHyphen && !spaceBeforeLPA && !spaceAroundHyphen) {
            message =
              "Enter salary with spaces around hyphen and before LPA like: 4 - 5 LPA";
          }

          // Case 4: Missing space before LPA
          else if (!spaceBeforeLPA) {
            message = "Please add space before LPA (Example: 5 LPA)";
          }

          // Case 5: Hyphen spacing issue
          else if (hasHyphen && !spaceAroundHyphen) {
            message = "Please add spaces around hyphen (Example: 4 - 5 LPA)";
          }

          // Case 6: Final format validation
          else if (
            !/^\d{1,2}(\.\d{1,2})?\sLPA$/.test(value) &&
            !/^\d{1,2}(\.\d{1,2})?\s-\s\d{1,2}(\.\d{1,2})?\sLPA$/.test(value)
          ) {
            message = "Enter salary like: 4 LPA or 4 - 5 LPA";
          }
        }
      }

      newErrors[field] = message;
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");

    if (hasErrors) return;

    onPost({
      ...formData,
      required_skills: formData.required_skills.split(",").map((s) => s.trim()),
    });
  };

  const isFormComplete =
    formData.title &&
    formData.description &&
    formData.required_skills &&
    formData.location &&
    formData.salary_range;

  const hasErrors = Object.values(errors).some((err) => err !== "");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Post New Job</h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <FiX className="text-xl text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Job Title *
              </label>
              <input
                value={formData.title}
                placeholder="Your Job Title"
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  validateField("title", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.title ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Job Type *</label>
              <select
                value={formData.job_type}
                onChange={(e) => {
                  const newType = e.target.value;

                  setFormData({
                    ...formData,
                    job_type: newType,
                  });

                  validateField("salary_range", formData.salary_range);
                }}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              placeholder="Your Job Description"
              rows={3}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                validateField("description", e.target.value);
              }}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                errors.description ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Required Skills *
              </label>
              <input
                value={formData.required_skills}
                placeholder="Required Skills for your job"
                onChange={(e) => {
                  setFormData({ ...formData, required_skills: e.target.value });
                  validateField("required_skills", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.required_skills ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.required_skills && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.required_skills}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                Enter skills separated by commas (Example: React, Node, MongoDB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Location *</label>
              <input
                value={formData.location}
                placeholder="Your Job Location"
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  validateField("location", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.location ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Salary Range *
              </label>
              <input
                value={formData.salary_range}
                placeholder={
                  formData.job_type === "Internship"
                    ? "Example: 8,000"
                    : "Example: 4 LPA OR 4 - 5 LPA"
                }
                onChange={(e) => {
                  setFormData({ ...formData, salary_range: e.target.value });
                  validateField("salary_range", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.salary_range ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.salary_range && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.salary_range}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormComplete || hasErrors}
              className={`px-6 py-2 rounded-lg text-sm font-bold text-white transition ${
                isFormComplete
                  ? "bg-[#0a66c2] hover:bg-[#084d91]"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= EDIT JOB MODAL =================

const EditJobModal = ({ job, isOpen, onClose, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    job_type: "",
    location: "",
    salary_range: "",
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        required_skills: job.required_skills?.join(", "),
        job_type: job.job_type,
        location: job.location,
        salary_range: job.salary_range,
      });
    }
  }, [job]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    required_skills: "",
    location: "",
    salary_range: "",
  });
  const validateField = (name, value) => {
    let message = "";

    if (name === "title") {
      if (!value.trim()) {
        message = "Job title is required";
      } else if (value.trim().length < 3) {
        message = "Job title must be at least 3 characters";
      } else if (value.trim().length > 80) {
        message = "Title cannot exceed 80 characters";
      } else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim())) {
        message =
          "Each word must start with a capital letter (Example: Database Administrator)";
      }
    }

    if (name === "description") {
      if (!value.trim()) {
        message = "Job description is required";
      } else if (value.trim().length < 20) {
        message = "Description must be at least 20 characters";
      }
    }

    if (name === "required_skills") {
      if (!value.trim()) {
        message = "Please enter required skills";
      }
    }

    if (name === "location") {
      if (!value.trim()) {
        message = "Location is required";
      } else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim())) {
        message =
          "Each word must start with a capital letter (Example: New York)";
      }
    }

    if (name === "salary_range") {
      if (!value.trim()) {
        message = "Salary is required";
      } else if (formData.job_type === "Internship") {
        if (!/^\d{1,3}(,\d{3})+$/.test(value)) {
          message =
            "Enter stipend with comma format (Example: 8,000 or 15,000)";
        }
      } else {
        const hasHyphen = value.includes("-");
        const hasLPALower = /lpa$/i.test(value) && !/LPA$/.test(value);
        const spaceBeforeLPA = /\sLPA$/.test(value);
        const spaceAroundHyphen = /\s-\s/.test(value);

        // Case 1: LPA missing
        if (!/lpa$/i.test(value)) {
          message =
            "Please enter salary with LPA (Example: 4 LPA or 4 - 5 LPA)";
        }

        // Case 2: LPA not capital
        else if (hasLPALower) {
          message = "LPA must be written in capital letters";
        }

        // Case 3: BOTH spacing mistakes
        else if (hasHyphen && !spaceBeforeLPA && !spaceAroundHyphen) {
          message =
            "Enter salary with spaces around hyphen and before LPA like: 4 - 5 LPA";
        }

        // Case 4: Missing space before LPA
        else if (!spaceBeforeLPA) {
          message = "Please add space before LPA (Example: 5 LPA)";
        }

        // Case 5: Hyphen spacing issue
        else if (hasHyphen && !spaceAroundHyphen) {
          message = "Please add spaces around hyphen (Example: 4 - 5 LPA)";
        }

        // Case 6: Final format validation
        else if (
          !/^\d{1,2}(\.\d{1,2})?\sLPA$/.test(value) &&
          !/^\d{1,2}(\.\d{1,2})?\s-\s\d{1,2}(\.\d{1,2})?\sLPA$/.test(value)
        ) {
          message = "Enter salary like: 4 LPA or 4 - 5 LPA";
        }
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    Object.keys(formData).forEach((field) => {
      let value = formData[field];
      let message = "";

      if (field === "title") {
        if (!value.trim()) message = "Job title is required";
        else if (value.trim().length < 3)
          message = "Job title must be at least 3 characters";
        else if (value.trim().length > 80)
          message = "Title cannot exceed 80 characters";
        else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim())) {
          message =
            "Each word must start with a capital letter (Example: Database Administrator)";
        }
      }

      if (field === "description") {
        if (!value.trim()) message = "Job description is required";
        else if (value.trim().length < 20)
          message = "Description must be at least 20 characters";
      }

      if (field === "required_skills") {
        if (!value.trim()) message = "Please enter required skills";
      }

      if (field === "location") {
        if (!value.trim()) message = "Location is required";
        else if (!/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value.trim()))
          message =
            "Each word must start with a capital letter (Example: New York)";
      }

      if (field === "salary_range") {
        if (!value.trim()) message = "Salary is required";
        else if (formData.job_type === "Internship") {
          if (!/^\d{1,3}(,\d{3})+$/.test(value)) {
            message =
              "Enter stipend with comma format (Example: 8,000 or 15,000)";
          }
        } else {
          const hasHyphen = value.includes("-");
          const hasLPALower = /lpa$/i.test(value) && !/LPA$/.test(value);
          const spaceBeforeLPA = /\sLPA$/.test(value);
          const spaceAroundHyphen = /\s-\s/.test(value);

          // Case 1: LPA missing
          if (!/lpa$/i.test(value)) {
            message =
              "Please enter salary with LPA (Example: 4 LPA or 4 - 5 LPA)";
          }

          // Case 2: LPA not capital
          else if (hasLPALower) {
            message = "LPA must be written in capital letters";
          }

          // Case 3: BOTH spacing mistakes
          else if (hasHyphen && !spaceBeforeLPA && !spaceAroundHyphen) {
            message =
              "Enter salary with spaces around hyphen and before LPA like: 4 - 5 LPA";
          }

          // Case 4: Missing space before LPA
          else if (!spaceBeforeLPA) {
            message = "Please add space before LPA (Example: 5 LPA)";
          }

          // Case 5: Hyphen spacing issue
          else if (hasHyphen && !spaceAroundHyphen) {
            message = "Please add spaces around hyphen (Example: 4 - 5 LPA)";
          }

          // Case 6: Final format validation
          else if (
            !/^\d{1,2}(\.\d{1,2})?\sLPA$/.test(value) &&
            !/^\d{1,2}(\.\d{1,2})?\s-\s\d{1,2}(\.\d{1,2})?\sLPA$/.test(value)
          ) {
            message = "Enter salary like: 4 LPA or 4 - 5 LPA";
          }
        }
      }

      newErrors[field] = message;
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");

    if (hasErrors) return;

    onUpdate({
      ...formData,
      required_skills: formData.required_skills.split(",").map((s) => s.trim()),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Edit Job</h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <FiX className="text-xl text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Job Title *
              </label>

              <input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  validateField("title", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.title ? "border-red-500" : "border-slate-200"
                }`}
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Job Type *</label>

              <select
                value={formData.job_type}
                onChange={(e) => {
                  setFormData({ ...formData, job_type: e.target.value });
                  validateField("salary_range", formData.salary_range);
                }}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Description *
            </label>

            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                validateField("description", e.target.value);
              }}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                errors.description ? "border-red-500" : "border-slate-200"
              }`}
            />

            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Required Skills *
              </label>

              <input
                value={formData.required_skills}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    required_skills: e.target.value,
                  });
                  validateField("required_skills", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.required_skills ? "border-red-500" : "border-slate-200"
                }`}
              />

              {errors.required_skills && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.required_skills}
                </p>
              )}

              <p className="text-xs text-slate-400 mt-1">
                Enter skills separated by commas (Example: React, Node, MongoDB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Location *</label>

              <input
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  validateField("location", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.location ? "border-red-500" : "border-slate-200"
                }`}
              />

              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Salary Range *
              </label>

              <input
                value={formData.salary_range}
                placeholder={
                  formData.job_type === "Internship"
                    ? "Example: 8,000"
                    : "Example: 4 LPA or 4 - 5 LPA"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    salary_range: e.target.value,
                  });
                  validateField("salary_range", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  errors.salary_range ? "border-red-500" : "border-slate-200"
                }`}
              />

              {errors.salary_range && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.salary_range}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-[#0a66c2] hover:bg-[#084d91] transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= MAIN PAGE =================

const EmployerJobs = () => {
  const { employer_id } = useSelector((state) => state.empDash);
  const token = useSelector((state) => state.auth.token);

  const loginPayload = useSelector((state) => ({
    email: state.auth.email?.trim(),
    password: state.auth.password,
    role: state.auth.role?.toLowerCase(),
  }));

  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");

  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [jobToEdit, setJobToEdit] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(3);

  const fetchJobs = async () => {
    const res = await axios.get(
      `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/All-jobs?employer_id=${employer_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          user: JSON.stringify(loginPayload),
        },
      },
    );

    setJobs(res.data.jobs);
  };

  useEffect(() => {
    if (employer_id) fetchJobs();
  }, [employer_id]);

  const handlePostJob = async (data) => {
    try {
      await axios.post(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/jobs`,
        {
          employer_id,
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );

      toast.success("Job posted successfully");

      setShowPostModal(false);

      fetchJobs();
    } catch {
      toast.error("Job posting failed");
    }
  };

  const handleEdit = (job) => {
    setJobToEdit(job);
    setShowEditModal(true);
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/jobDelete/${jobId}`,
        {
          data: { employer_id },
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );

      toast.success("Job deleted");

      fetchJobs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdateJob = async (updatedData) => {
    try {
      setUpdateLoading(true);

      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/jobUpdate/${jobToEdit._id}`,
        {
          employer_id,
          ...updatedData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );

      toast.success("Job updated");

      setShowEditModal(false);

      fetchJobs();
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredJobs = jobs.filter((j) => j.status === activeTab);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const showPagination = filteredJobs.length > 0;

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 hover:bg-slate-300 text-base font-medium mb-3 px-5 py-3 rounded-lg transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Jobs</h1>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-[#0a66c2] hover:bg-[#084d91] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            <FiPlus className="text-lg" />
            Post Job
          </button>
        </div>

        <div className="flex gap-6 mb-8">
          {["Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-white border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* JOB LIST */}

        {currentJobs.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-slate-400 text-lg font-medium">
              No {activeTab} Jobs
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= PAGINATION ================= */}

      {showPagination && (
        <div className="flex items-center justify-between pt-6 pb-6 border-t border-slate-200 max-w-4xl mx-auto mt-8">
          {/* PREVIOUS BUTTON */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1} // Disable on first page
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-100"
          >
            <FiChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* PAGE INFO */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>

          {/* NEXT BUTTON */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages} // Disable on last page
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-100"
          >
            Next
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <PostJobModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPost={handlePostJob}
      />

      <EditJobModal
        job={jobToEdit}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateJob}
        loading={updateLoading}
      />
    </div>
  );
};

export default EmployerJobs;