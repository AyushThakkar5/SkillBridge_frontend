import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiUser,
} from "react-icons/fi";
import { MdEmail, MdPerson, MdPhone } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

const Candidate_Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    candidate_id,
    full_name,
    phone,
    linkedin_url,
    resume,
    github_url,
    skills,
  } = useSelector((state) => state.candDash);
  const { token, email, password, role } = useSelector((state) => state.auth);

  const [statsLoading, setStatsLoading] = useState(true);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [stats, setStats] = useState({
    applied: 0,
    matched: 0,
    responses: 0,
  });

  const fetchApplications = useCallback(async () => {
    if (!candidate_id || !token) return;

    try {
      setStatsLoading(true);
      const response = await axios.get(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/candidate-detail/application-detail/${candidate_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify({ email, password, role }),
          },
        },
      );

      const applications = response.data.data || [];

      const statsData = {
        applied:
          applications.filter((app) => app.status === "Applied")?.length || 0,
        matched:
          applications.filter((app) => app.status === "Matched")?.length || 0,
        responses:
          applications.filter(
            (app) => app.status !== "Applied" && app.status !== "Matched",
          )?.length || 0,
      };

      setStats(statsData);
      console.log("Data : ", response);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to fetch applications",
      );
    } finally {
      setStatsLoading(false);
    }
  }, [candidate_id, token, email, password, role]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleViewMatched = () => {
    navigate("/viewmatched", {
      state: {
        applications: [],
        candidate_id,
        type: "matched",
        candidateName: full_name,
        stats,
      },
    });
  };

  const handleViewApplied = () => {
    navigate("/viewapplied", {
      state: {
        applications: [],
        candidate_id,
        type: "applied",
        candidateName: full_name,
        stats,
      },
    });
  };

  // ✅ CHANGE 1: Added handleViewResponses
  const handleViewResponses = () => {
    navigate("/viewresponse", {
      state: {
        applications: [],
        candidate_id,
        type: "responses",
        candidateName: full_name,
        stats,
      },
    });
  };

  const userName = full_name || "User";
  const displaySkills = showMoreSkills
    ? skills || []
    : (skills || []).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-12 pb-12">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">
            Welcome, <span className="text-[#008bdc]">{userName}</span>
          </h1>
        </div>

        {/* ================= PROFILE SECTION ================= */}
        <div
          className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-10 mb-8 flex flex-col lg:flex-row lg:items-start justify-between gap-6 transition-all duration-300 ${showMoreSkills ? "min-h-[520px]" : "min-h-[320px]"}`}
        >
          {/* Left Profile */}
          <div className="flex flex-col flex-1 lg:flex-[2]">
            {/* Icon + Profile Info */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-28 h-28 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                <MdPerson className="text-slate-400 text-6xl" />
              </div>

              {/* Profile Info */}
              <div className="space-y-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-800 truncate">
                  {userName}
                </h3>

                <div className="flex items-center gap-2 text-base text-slate-600">
                  <MdEmail className="text-slate-400 text-lg" />
                  <span>{email}</span>
                </div>

                {phone && (
                  <div className="flex items-center gap-2 text-base text-slate-600">
                    <MdPhone className="text-slate-400 text-lg" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills below icon */}
            {skills && skills.length > 0 && (
              <div className="space-y-3 mt-6">
                <h4 className="text-lg font-semibold text-slate-800">Skills</h4>

                <div className="flex flex-wrap gap-2 max-w-[320px]">
                  {displaySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {skills.length > 4 && (
                  <button
                    onClick={() => setShowMoreSkills(!showMoreSkills)}
                    className="flex items-center gap-1 text-[#008bdc] text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    {showMoreSkills ? "Show Less" : "Show More"}
                    <FiChevronDown
                      className={`transition-transform ${showMoreSkills ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Social Links & Edit Profile */}
          <div className="flex flex-col items-end gap-8 lg:w-80 flex-shrink-0">
            {/* Social Links - BLUE LINK FORMAT */}
            <div className="space-y-2 w-full lg:w-auto text-right">
              {linkedin_url && (
                <a
                  href={linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#008bdc] hover:text-blue-600 font-medium text-sm transition-colors group hover:underline"
                >
                  LinkedIn
                </a>
              )}

              {github_url && (
                <a
                  href={github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#008bdc] hover:text-blue-600 font-medium text-sm transition-colors group hover:underline"
                >
                  GitHub
                </a>
              )}

              {resume && (
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#008bdc] hover:text-blue-600 font-medium text-sm transition-colors group hover:underline"
                >
                  Resume
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-24 bg-slate-10 hidden lg:block"></div>

            {/* Edit Profile Button */}
            <div className="mt-auto">
              <button
                onClick={() => navigate("/candidate-profile")}
                className="bg-[#008bdc] text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap w-full lg:w-auto"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Applied */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 text-2xl">
                <FiBriefcase />
              </div>
              <span className="text-3xl font-bold text-slate-800">
                {statsLoading ? "--" : stats.applied}
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              Applied Jobs
            </h3>
            <button
              onClick={handleViewApplied}
              className="mt-4 w-full bg-[#008bdc] text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
              disabled={statsLoading}
            >
              View Applications
            </button>
          </div>

          {/* Matched */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-green-50 text-green-600 text-2xl">
                <FiCheckCircle />
              </div>
              <span className="text-3xl font-bold text-slate-800">
                {statsLoading ? "--" : stats.matched}
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              Matched Jobs
            </h3>
            <button
              onClick={handleViewMatched}
              className="mt-4 w-full bg-[#008bdc] text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
              disabled={statsLoading}
            >
              View Matches
            </button>
          </div>

          {/* Company Response - ✅ CHANGE 1: Added navigation to /viewresponse */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-purple-50 text-purple-600 text-2xl">
                <FiUser />
              </div>
              <span className="text-3xl font-bold text-slate-800">
                {statsLoading ? "--" : stats.responses}
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              Company Responses
            </h3>
            <button
              onClick={handleViewResponses} // ✅ Updated from toast.info
              className="mt-4 w-full bg-[#008bdc] text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
              disabled={statsLoading}
            >
              View Responses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidate_Dashboard;
