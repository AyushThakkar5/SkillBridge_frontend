import axios from "axios";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

const EmployerApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const loginPayload = useSelector((state) => ({
    email: state.auth.email?.trim(),
    password: state.auth.password,
    role: state.auth.role?.toLowerCase(),
  }));

  const [applications, setApplications] = useState([]);

  const fetchApps = async () => {
    const res = await axios.get(
      `https://skillbridge-backend-3-vqsm.onrender.com/api/employer-detail/jobs/${jobId}/applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          user: JSON.stringify(loginPayload),
        },
      },
    );

    setApplications(res.data.applications);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Back Button */}
        <div className="relative flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 hover:bg-slate-300 text-base font-medium px-5 py-3 rounded-lg transition-all duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-slate-800">
            Candidate Applications
          </h1>
        </div>

        {/* Table Container */}
        {applications.length === 0 ? (
          <div className="flex justify-center items-center py-32">
            <p className="text-slate-400 text-lg font-medium">
              No Applied Candidates
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            <table className="w-full border-collapse">
              {/* Table Head */}
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700 tracking-wide">
                    Candidate
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700 tracking-wide">
                    Email
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700 tracking-wide">
                    Match
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700 tracking-wide">
                    Status
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700 tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.application_id}
                    className="border-t hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-5 px-6 text-center font-medium text-slate-800">
                      {app.candidate_name}
                    </td>

                    <td className="py-5 px-6 text-center text-slate-600">
                      {app.email}
                    </td>

                    <td className="py-5 px-6 text-center font-semibold text-slate-700">
                      {app.match_percent}%
                    </td>

                    <td className="py-5 px-6 text-center text-slate-700">
                      {app.status}
                    </td>

                    <td className="py-5 px-6 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/employer/applications/${app.application_id}`,
                          )
                        }
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerApplications;
