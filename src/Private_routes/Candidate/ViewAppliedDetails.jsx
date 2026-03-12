import {
  FiArrowLeft,
  FiBriefcase,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const ViewAppliedDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { application } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button - EXACT SAME */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 text-gray-700 font-medium"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {application ? (
          <>
            {/* Header Row - EXACT SAME */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {application.job_title}
                </h1>
                <p className="text-2xl text-gray-600 font-semibold">
                  {application.company_name}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-end items-end">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                    application.status === "Applied"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : application.status === "interview"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {application.status}
                </span>
                {application.match_percent && (
                  <span className="px-4 py-2 bg-gray-50 text-gray-800 text-sm font-semibold border border-gray-200 rounded-lg">
                    {application.match_percent}% Match
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Content - EXACT SAME */}
              <div className="xl:col-span-2">
                {/* Job Details - EXACT SAME */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Job Details
                    </h2>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <FiMapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </span>
                          </div>
                          <p className="text-2xl font-semibold text-gray-900">
                            {application.location}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <FiBriefcase className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Job Type
                            </span>
                          </div>
                          <p className="text-2xl font-semibold text-gray-900">
                            {application.job_type}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                          <div className="flex items-center gap-3 mb-3">
                            <FiDollarSign className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Salary Range
                            </span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">
                            {application.salary_range}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Sidebar - APPLIED VERSION */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm sticky top-8 p-8">
                  <div className="text-center mb-8 pb-8 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Application Status
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Track your application progress
                    </p>
                  </div>

                  <div className="text-center">
                    <span className="px-6 py-3 bg-gray-100 text-gray-800 text-lg font-semibold rounded-xl border-2 border-gray-200">
                      {application.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto py-20 text-center">
            <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Application Not Found
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                No application data available.
              </p>
              <button
                onClick={handleBack}
                className="w-full max-w-sm mx-auto bg-gray-800 text-white py-4 px-8 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Back to Applications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAppliedDetails;
