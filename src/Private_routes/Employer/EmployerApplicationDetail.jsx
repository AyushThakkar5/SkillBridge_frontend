import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiClipboard,
  FiCode,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

const EmployerApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const loginPayload = useSelector((state) => ({
    email: state.auth.email?.trim(),
    password: state.auth.password,
    role: state.auth.role?.toLowerCase(),
  }));

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );

      setData(res.data.data);
      setStatus(res.data.data.application.status);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmStatusChange = (newStatus) => {
    setPendingStatus(newStatus);
    setShowConfirm(true);
  };

  const updateStatus = async () => {
    try {
      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/applications/${applicationId}/status`,
        { status: pendingStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );

      setStatus(pendingStatus);
      setShowConfirm(false);
      setPendingStatus(null);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  const [showUpdatedDetails, setShowUpdatedDetails] = useState(false);

  // FIX: Instead of `return null`, we show a subtle loading text matching your theme
  // This prevents the "white screen" crash while the API is fetching
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-slate-500 font-medium">
          Loading application details...
        </div>
      </div>
    );
  }

  const currentStatus = status;

  const validTransitions = {
    Applied: ["Under Review", "Shortlisted", "Selected", "Rejected"],
    "Under Review": ["Shortlisted", "Selected", "Rejected"],
    Shortlisted: ["Selected", "Rejected"],
    Selected: [],
    Rejected: [],
  };

  const allowedNext = validTransitions[currentStatus] || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 bg-slate-200 text-slate-700 hover:bg-slate-300 text-base font-medium px-5 py-3 rounded-lg transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Candidate Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FiUser className="text-slate-600 text-2xl" />
            <h1 className="text-4xl font-extrabold text-slate-800">
              {data.candidate.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-slate-600 text-base mb-1">
            <FiMail className="w-5 h-5" />
            <p>{data.candidate.email}</p>
          </div>

          <div className="flex items-center gap-3 text-slate-600 text-base mb-5">
            <FiPhone className="w-5 h-5" />
            <p>{data.candidate.phone}</p>
          </div>

          {/* Professional Links */}
          <div className="flex flex-wrap gap-8 text-base font-medium mt-4">
            <a
              href={data.candidate.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline"
            >
              <FiGithub className="w-5 h-5" />
              GitHub Profile
            </a>

            <a
              href={data.candidate.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline"
            >
              <FiLinkedin className="w-5 h-5" />
              LinkedIn Profile
            </a>

            <a
              href={data.candidate.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline"
            >
              <FiFileText className="w-5 h-5" />
              View / Download Resume
            </a>
          </div>
        </div>

        {/* Match + Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Match Card */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
              <FiAward />
              <p className="text-sm font-semibold">Skill Match</p>
            </div>

            <p className="text-3xl font-bold text-green-700">
              {data.application.match_percent}%
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center h-full md:col-span-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FiCheckCircle className="text-slate-600 w-5 h-5" />
              <p className="text-base font-medium text-slate-600">
                Application Status
              </p>
            </div>

            <div className="flex flex-wrap justify-center bg-slate-100 rounded-4xl p-2 gap-2 max-w-full">
              {/* Current status always visible */}
              <button className="px-5 py-2 text-base rounded-full bg-white shadow-sm text-slate-900 font-bold border border-slate-200">
                {currentStatus}
              </button>

              {/* Next statuses */}
              {allowedNext.map((status) => (
                <button
                  key={status}
                  onClick={() => confirmStatusChange(status)}
                  className="px-5 py-2 text-base font-medium rounded-full text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Skills */}
        {data.candidate.skills && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <FiCode className="text-slate-600 w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-800">
                Candidate Skills
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {data.candidate.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-800 border border-slate-200 px-5 py-2 rounded-full text-base font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Overview */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          {/* HEADER */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5 mb-8">
            <FiBarChart2 className="text-blue-700 w-7 h-7" />
            <h2 className="text-2xl font-bold text-slate-800">
              Application Overview
            </h2>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* MATCHED SKILLS */}
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <p className="text-base text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Matched Skills
              </p>
              <p className="text-4xl font-extrabold text-blue-700">
                {data.application?.matched_skills?.length || 0}
              </p>
            </div>

            {/* APPLIED DATE */}
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <p className="text-base text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Applied Date
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {data.application?.appliedAt
                  ? new Date(data.application.appliedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {/* MATCHED DATE */}
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <p className="text-base text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Matched Date
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {data.application?.matchedAt
                  ? new Date(data.application.matchedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* SKILLS PANELS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* REQUIRED */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex items-center gap-3">
                <FiClipboard className="text-slate-600 w-5 h-5" />
                <h4 className="text-lg font-bold text-slate-800">
                  Requirements ({data.job?.required_skills?.length || 0})
                </h4>
              </div>
              {/* Added 'content-start grow' so the box fills height, but chips stay at the top */}
              <div className="p-6 flex flex-wrap content-start gap-2 grow">
                {data.job?.required_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-base font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* MATCHED */}
            <div className="bg-white border border-green-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-green-50 border-b border-green-200 px-6 py-5 flex items-center gap-3">
                <FiCheckCircle className="text-green-700 w-5 h-5" />
                <h4 className="text-lg font-bold text-green-900">
                  Matched ({data.application?.matched_skills?.length || 0})
                </h4>
              </div>
              <div className="p-6 flex flex-wrap content-start gap-2 grow">
                {data.application?.matched_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-green-50 text-green-800 border border-green-200 rounded-full text-base font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div className="bg-white border border-amber-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-5 flex items-center gap-3">
                <FiAlertCircle className="text-amber-700 w-5 h-5" />
                <h4 className="text-lg font-bold text-amber-900">
                  Missing ({data.application?.missing_skills?.length || 0})
                </h4>
              </div>
              <div className="p-6 flex flex-wrap content-start gap-2 grow">
                {data.application?.missing_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-base font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PROFILE CHANGE ALERT */}
          {data.candidate?.profile_version >
            data.application?.profile_version_snapshot && (
            <div className="mt-10 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              {/* Accordion Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-l-4 border-blue-700 p-6">
                <div>
                  <p className="text-sm uppercase tracking-wider text-blue-700 font-bold mb-2">
                    Action Recommended
                  </p>

                  <p className="text-2xl font-bold text-slate-800 mb-1">
                    Profile updated{" "}
                    {(data.candidate?.profile_version || 0) -
                      (data.application?.profile_version_snapshot || 0)}{" "}
                    time
                    {(data.candidate?.profile_version || 0) -
                      (data.application?.profile_version_snapshot || 0) >
                      1 && "s"}
                  </p>

                  <p className="text-base text-slate-600">
                    The candidate has modified their core profile since this
                    application was submitted.
                  </p>
                </div>

                {/* TOGGLE BUTTON */}
                <div className="flex md:justify-end shrink-0">
                  <button
                    onClick={() => setShowUpdatedDetails(!showUpdatedDetails)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 border border-blue-200 transition font-bold text-base"
                  >
                    {showUpdatedDetails ? "Hide Updates" : "View Updates"}
                    {showUpdatedDetails ? (
                      <FiChevronUp className="w-5 h-5" />
                    ) : (
                      <FiChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Accordion Body (Expanded Content) */}
              {showUpdatedDetails && (
                <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Updated Profile Details
                    </h3>
                    <p className="text-base text-slate-500 mt-1">
                      Latest candidate updates after applying
                    </p>
                  </div>

                  {/* RESUME */}
                  {data.candidate?.resume && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-full">
                          <FiFileText className="text-blue-700 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-800">
                            Resume
                          </p>
                          <p className="text-base text-slate-500">
                            Latest uploaded resume
                          </p>
                        </div>
                      </div>

                      <a
                        href={data.candidate.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition text-base font-medium shadow-sm"
                      >
                        Download Resume
                      </a>
                    </div>
                  )}

                  {/* SKILLS */}
                  {data.candidate?.skills &&
                    Array.isArray(data.candidate.skills) && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                          <FiCode className="text-slate-600 w-6 h-6" />
                          <h4 className="text-lg font-bold text-slate-800">
                            Latest Skills
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {data.candidate.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-5 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-base font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Confirm Status Change
            </h3>

            <p className="text-lg text-slate-600 mb-8">
              Are you sure you want to change the application status to{" "}
              <span className="font-bold text-slate-900">{pendingStatus}</span>?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-3 text-base font-medium border border-slate-300 rounded-full hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={updateStatus}
                className="px-6 py-3 text-base font-medium bg-blue-700 text-white rounded-full hover:bg-blue-800 transition shadow-sm"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplicationDetail;