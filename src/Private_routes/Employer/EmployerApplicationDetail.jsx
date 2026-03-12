import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiAward,
  FiCheckCircle,
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

  if (!data) return null;

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
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mb-4 px-5 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Candidate Header */}
        <div className="bg-white p-8 rounded-xl shadow mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FiUser className="text-slate-600 text-xl" />
            <h1 className="text-3xl font-bold text-slate-800">
              {data.candidate.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <FiMail />
            <p>{data.candidate.email}</p>
          </div>

          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <FiPhone />
            <p>{data.candidate.phone}</p>
          </div>

          {/* Professional Links */}
          <div className="flex flex-wrap gap-6 text-sm font-medium mt-4">
            <a
              href={data.candidate.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FiGithub />
              GitHub Profile
            </a>

            <a
              href={data.candidate.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FiLinkedin />
              LinkedIn Profile
            </a>

            <a
              href={data.candidate.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FiFileText />
              View / Download Resume
            </a>
          </div>
        </div>

        {/* Match + Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Match Card */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
              <FiAward />
              <p className="text-sm font-semibold">Skill Match</p>
            </div>

            <p className="text-3xl font-bold text-green-700">
              {data.application.match_percent}%
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center text-center h-full md:col-span-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FiCheckCircle className="text-slate-600" />
              <p className="text-sm text-slate-500">Application Status</p>
            </div>

            <div className="flex flex-wrap justify-center bg-slate-100 rounded-xl p-1 gap-1 max-w-full">
              {/* Current status always visible */}
              <button className="px-3 py-1 text-sm rounded-lg bg-white shadow text-slate-800 font-medium">
                {currentStatus}
              </button>

              {/* Next statuses */}
              {allowedNext.map((status) => (
                <button
                  key={status}
                  onClick={() => confirmStatusChange(status)}
                  className="px-3 py-1 text-sm rounded-lg text-slate-600 hover:bg-slate-200 transition"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        {data.candidate.skills && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiCode className="text-slate-600" />
              <h2 className="text-xl font-semibold">Skills</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.candidate.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Confirm Status Change
            </h3>

            <p className="text-slate-600 mb-6">
              Are you sure you want to change the status to{" "}
              <span className="font-semibold">{pendingStatus}</span> ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={updateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplicationDetail;
