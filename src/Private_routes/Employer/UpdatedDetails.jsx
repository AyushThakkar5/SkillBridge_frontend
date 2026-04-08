import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFileText, FiCode } from "react-icons/fi";

const UpdatedDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const candidate = state?.candidate;

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        No data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* CONTAINER */}
      <div className="max-w-5xl mx-auto py-10 px-6">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mb-6 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition"
        >
          <FiArrowLeft />
          Back
        </button>

        {/* CARD */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Updated Profile Details
            </h1>
            <p className="text-sm text-slate-500">
              Latest candidate updates after applying
            </p>
          </div>

          {/* RESUME */}
          {candidate.resume && (
            <div className="border rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiFileText className="text-slate-600" />
                <div>
                  <p className="font-medium text-slate-800">Resume</p>
                  <p className="text-sm text-slate-500">
                    Latest uploaded resume
                  </p>
                </div>
              </div>

              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Download
              </a>
            </div>
          )}

          {/* SKILLS */}
          {candidate.skills && (
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiCode className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UpdatedDetails;