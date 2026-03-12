import { FiArrowLeft, FiMapPin, FiDollarSign, FiBriefcase } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const ViewResponseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { application } = location.state || {};

  const handleBack = () => navigate(-1);

  const formatDate = (date) => {
    if (!date) return "Date not available";
    try {
      return new Date(date).toLocaleString();
    } catch (e) {
      return String(date);
    }
  };

  const getResponseDate = (app) => {
    console.log(app.createdAt)
    return (
      app?.response_date || app?.updatedAt || app?.createdAt || app?.applied_at || app?.date
    );
  };

  const getCompanyMessage = (app) => {
    return (
      app?.company_response || app?.response_message || app?.message || app?.notes || app?.recruiter_message || "No additional message from company."
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {application.job_title}
                </h1>
                <p className="text-2xl text-gray-600 font-semibold">
                  {application.company_name}
                </p>
              </div>

              <div className="flex flex-col justify-end items-end gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                  application.status === 'interview' ? 'bg-blue-50 text-blue-800 border-blue-200' : application.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {application.status}
                </span>
                {/* <div className="text-sm text-slate-500">
                  Date: <span className="font-medium text-slate-700">{formatDate(getResponseDate(application))}</span>
                </div> */}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <div className="xl:col-span-2">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900">Company Response</h2>
                  </div>

                  <div className="p-8">
                    <p className="text-slate-700 text-base whitespace-pre-wrap">{getCompanyMessage(application)}</p>
                  </div>
                </div>

                <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <FiMapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</span>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900">{application.location || '—'}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <FiBriefcase className="w-5 h-5 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</span>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900">{application.job_type || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm sticky top-8 p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Response Status</h3>
                    <p className="text-gray-600 text-sm">Details from the company</p>
                  </div>

                  <div className="text-center">
                    <span className="px-6 py-3 bg-gray-100 text-gray-800 text-lg font-semibold rounded-xl border-2 border-gray-200">{application.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto py-20 text-center">
            <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Not Found</h2>
              <p className="text-gray-600 mb-8 text-lg">No response data available.</p>
              <button onClick={handleBack} className="w-full max-w-sm mx-auto bg-gray-800 text-white py-4 px-8 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg">Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResponseDetails;
