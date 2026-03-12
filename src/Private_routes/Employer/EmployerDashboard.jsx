import axios from "axios";
import { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa6";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiLinkedin,
  FiLock,
  FiUsers,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Icon from "../../assets/Icon.png";
import Navbar from "../../components/Navbar";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
    <div className="text-blue-600 text-2xl">{icon}</div>
    <div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-slate-500 uppercase">{title}</div>
    </div>
  </div>
);

const EmployerDashboard = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { employer_id, companyName, linkedin, full_name, company_description } =
    useSelector((state) => state.empDash);
  const token = useSelector((state) => state.auth.token);

  const loginPayload = useSelector((state) => ({
    email: state.auth.email?.trim(),
    password: state.auth.password,
    role: state.auth.role?.toLowerCase(),
  }));

  const [stats, setStats] = useState({
    total_jobs: 0,
    approved_jobs: 0,
    pending_jobs: 0,
    total_matches: 0,
    total_applications: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/dashboard/stats?employer_id=${employer_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify(loginPayload),
          },
        },
      );
      setStats(res.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (employer_id) fetchStats();
  }, [employer_id]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] font-sans">
      <Navbar />

      {/* Container: Slightly reduced from the max zoom, but still spacious */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome, {full_name}
          </h1>
          <p className="text-slate-500 mt-1.5 text-base font-medium">
            Manage your job postings and applicants
          </p>
        </div>

        {/* Employer Profile Card */}
        <div className="bg-white p-5 rounded-[1.25rem] shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Left Side */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#F0F5FF] text-blue-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              <FaBuilding />
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">
                {companyName}
              </p>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {company_description || "Thank You"}
              </p>
            </div>
          </div>

          {/* Right Side (LinkedIn & Password) */}
          <div className="flex flex-col md:items-end items-center gap-4 ml-auto">
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline"
            >
              <FiLinkedin className="text-lg" />
              LinkedIn
            </a>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-all duration-200"
            >
              <FiLock className="text-md" />
              Change Password
            </button>
          </div>
        </div>

        {/* STAT CARDS & MANAGE JOBS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          {/* Total Jobs */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 text-xl">
              <FiBriefcase />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {stats.total_jobs}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 tracking-wider">
              TOTAL JOBS
            </p>
            <div className="w-7 h-1.5 bg-blue-600 rounded-full mt-4"></div>
          </div>

          {/* Approved Jobs */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start relative">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-4 text-xl">
              <FiCheckCircle />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {stats.approved_jobs}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 tracking-wider">
              APPROVED JOBS
            </p>
            <div className="w-7 h-1.5 bg-green-500 rounded-full mt-4"></div>
          </div>

          {/* Pending Jobs */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start relative">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center mb-4 text-xl">
              <FiClock />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {stats.pending_jobs}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 tracking-wider">
              PENDING JOBS
            </p>
            <div className="w-7 h-1.5 bg-orange-400 rounded-full mt-4"></div>
          </div>

          {/* Matches */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start relative">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4 text-xl">
              <FiUsers />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {stats.total_matches}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 tracking-wider">
              MATCHES
            </p>
            <div className="w-7 h-1.5 bg-purple-500 rounded-full mt-4"></div>
          </div>

          {/* Applications */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 text-xl">
              <FiFileText />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {stats.total_applications}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 tracking-wider">
              APPLICATIONS
            </p>
            <div className="w-7 h-1.5 bg-blue-500 rounded-full mt-4"></div>
          </div>

          {/* Manage Jobs Action Card */}
          {/* Manage Jobs Action Card */}
          <div
            onClick={() => navigate("/employer-jobs")}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow relative"
          >
            <div className="w-full flex items-center justify-center mb-3 bg-blue-50 rounded-xl py-3">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-100">
                <img src={Icon} alt="Manage Jobs" className="h-10 w-10 object-contain" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <span className="font-bold text-slate-800 text-base leading-tight">Manage</span>
                <div className="text-slate-500 text-sm">Jobs & Openings</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors shrink-0">
                <FiArrowRight className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl w-[440px]">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>

              <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
