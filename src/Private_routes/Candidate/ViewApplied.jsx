import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiBriefcase } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

const ViewApplied = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, email, password, role } = useSelector((state) => state.auth);
  const { candidate_id } = useSelector((state) => state.candDash);

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  const stateCandidateId = location.state?.candidate_id || candidate_id;

  const fetchAppliedApplications = useCallback(async () => {
    if (!stateCandidateId || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/candidate-detail/application-detail/${stateCandidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify({ email, password, role }),
          },
        },
      );

      const allApplications = response.data.data || [];
      const appliedApps = allApplications.filter(
        (app) => app.status === "Applied",
      );
      setApplications(appliedApps);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to fetch applications",
      );
    } finally {
      setLoading(false);
    }
  }, [stateCandidateId, token, email, password, role, navigate]); // ✅ Added navigate to deps

  useEffect(() => {
    fetchAppliedApplications();
  }, [fetchAppliedApplications]);

  const handleBackToDashboard = () => {
    navigate(-1);
  };

  // ✅ FIXED: Correct path to viewapplied-details
  const handleViewApplication = (applicationId) => {
    const application = applications.find(
      (app) => app.application_id === applicationId,
    );
    navigate("/viewapplied-details", {
      state: { application }, // ✅ Only pass application data
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-12 pb-12">
        {/* Back Button Only - EXACT SAME */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all shadow-sm"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Applied Jobs Heading - EXACT SAME */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Applied Jobs ({applications.length})
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            {applications.length === 1
              ? "1 application"
              : `${applications.length} applications`}
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 border-3 border-blue-100 border-t-[#008bdc] rounded-full animate-spin"></div>
              <span className="text-slate-600 font-medium">
                Loading your applied jobs...
              </span>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-2xl mx-auto">
            <FiBriefcase className="w-20 h-20 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              No Applied Jobs
            </h3>
            <p className="text-slate-600 mb-6">
              You haven't applied to any jobs yet.
            </p>
            <button
              onClick={handleBackToDashboard}
              className="bg-[#008bdc] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application.application_id}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm"
              >
                <div className="space-y-4">
                  {/* Job Title & Company - EXACT SAME */}
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 group-hover:text-[#008bdc] transition-colors mb-2">
                      {application.job_title}
                    </h4>
                    <p className="text-lg font-semibold text-slate-700">
                      {application.company_name}
                    </p>
                  </div>

                  {/* Action Button - FIXED NAVIGATION */}
                  <div className="pt-4">
                    <button
                      onClick={() =>
                        handleViewApplication(application.application_id)
                      }
                      className="w-full bg-gradient-to-r from-[#008bdc] to-blue-600 text-white py-4 px-6 rounded-2xl text-base font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplied;
