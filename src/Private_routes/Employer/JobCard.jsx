import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all duration-200 p-7 min-h-[400px] flex flex-col justify-between">
      {/* Job Title */}
      <h2 className="text-2xl font-bold mb-2 text-slate-800">{job.title}</h2>

      {/* Job Info */}
      <div className="flex flex-wrap items-center gap-3 text-base text-slate-500 mb-4">
        <span>{job.location}</span>
        <span>•</span>
        <span>{job.job_type}</span>
        <span>•</span>
        <span>{job.salary_range}</span>
      </div>

      {/* Description */}
      <p className="text-base text-slate-700 mb-4 line-clamp-3">
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.required_skills?.map((skill, i) => (
          <span
            key={i}
            className="bg-slate-100 text-slate-800 px-3 py-1 text-sm rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {/* Pending Jobs */}
        {job.status === "Pending" && (
          <>
            <button
              onClick={() => onEdit(job)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(job._id)}
              className="px-4 py-2 border border-black-800 text-black-800 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </>
        )}

        {/* Approved Jobs */}
        {job.status === "Approved" && (
          <button
            onClick={() => navigate(`/employer-applications/${job._id}`)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View Applications
          </button>
        )}

        {/* Rejected Jobs */}
        {job.status === "Rejected" && (
          <span className="px-4 py-2 bg-red-200 text-red-800 text-base rounded">
            Rejected
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
