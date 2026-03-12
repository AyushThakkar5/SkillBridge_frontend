import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { full_name, email, linkedin_url, github_url, resume, phone } = useSelector((state) => state.candDash);

  const [linkedinEdit, setLinkedinEdit] = useState(false);
  const [githubEdit, setGithubEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [linkedinValue, setLinkedinValue] = useState(linkedin_url || "");
  const [githubValue, setGithubValue] = useState(github_url || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLinkedinUpdate = () => {
    console.log("LinkedIn updated to:", linkedinValue);
    setLinkedinEdit(false);
  };

  const handleGithubUpdate = () => {
    console.log("GitHub updated to:", githubValue);
    setGithubEdit(false);
  };

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setPasswordEdit(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-base font-semibold p-2 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex-1" />
          </div>

          {/* Profile Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">{full_name}</h1>
            <p className="text-lg text-slate-600 mb-6">Profile Settings</p>
          </div>

          {/* Profile Sections - 4 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LinkedIn Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">LinkedIn Profile</h3>
                {!linkedinEdit ? (
                  <button
                    onClick={() => setLinkedinEdit(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-900 transition-all duration-200"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Update
                  </button>
                ) : (
                  <button
                    onClick={handleLinkedinUpdate}
                    className="px-4 py-1.5 bg-[#008bdc] text-white text-sm font-bold rounded-md hover:bg-blue-600 transition-all duration-200"
                  >
                    Save
                  </button>
                )}
              </div>
              
              {!linkedinEdit ? (
                <div className="space-y-2">
                  <p className="text-slate-500 text-xs">Current LinkedIn URL</p>
                  <div className="p-3 bg-white rounded-md border border-slate-200 max-w-full">
                    {linkedin_url ? (
                      <a 
                        href={linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#0a66c2] font-semibold hover:underline block text-sm break-all"
                      >
                        {linkedin_url}
                      </a>
                    ) : (
                      <span className="text-slate-400 font-medium text-sm">No LinkedIn profile added</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={linkedinValue}
                    onChange={(e) => setLinkedinValue(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full p-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#008bdc]/50 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button
                    onClick={() => {
                      setLinkedinEdit(false);
                      setLinkedinValue(linkedin_url || "");
                    }}
                    className="px-4 py-1.5 bg-slate-200 text-slate-800 text-sm font-semibold rounded-md hover:bg-slate-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* GitHub Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">GitHub Profile</h3>
                {!githubEdit ? (
                  <button
                    onClick={() => setGithubEdit(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-900 transition-all duration-200"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Update
                  </button>
                ) : (
                  <button
                    onClick={handleGithubUpdate}
                    className="px-4 py-1.5 bg-[#008bdc] text-white text-sm font-bold rounded-md hover:bg-blue-600 transition-all duration-200"
                  >
                    Save
                  </button>
                )}
              </div>
              
              {!githubEdit ? (
                <div className="space-y-2">
                  <p className="text-slate-500 text-xs">Current GitHub URL</p>
                  <div className="p-3 bg-white rounded-md border border-slate-200 max-w-full">
                    {github_url ? (
                      <a 
                        href={github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-black font-semibold hover:underline block text-sm break-all"
                      >
                        {github_url}
                      </a>
                    ) : (
                      <span className="text-slate-400 font-medium text-sm">No GitHub profile added</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={githubValue}
                    onChange={(e) => setGithubValue(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className="w-full p-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#008bdc]/50 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button
                    onClick={() => {
                      setGithubEdit(false);
                      setGithubValue(github_url || "");
                    }}
                    className="px-4 py-1.5 bg-slate-200 text-slate-800 text-sm font-semibold rounded-md hover:bg-slate-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Resume Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-all duration-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Resume</h3>
              <div className="space-y-3">
                <p className="text-slate-500 text-xs">Current Resume</p>
                {resume ? (
                  <div className="p-3 bg-white rounded-md border border-slate-200 mb-4">
                    <a 
                      href={resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-800 font-semibold hover:underline text-sm"
                    >
                      📄 {resume.split('/').pop() || 'Resume.pdf'}
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-md border-2 border-dashed border-slate-300 text-center">
                    <p className="text-slate-500 text-sm">No resume uploaded</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 text-xs">Upload New Resume</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    className="w-full px-3 py-3 border-2 border-dashed border-slate-300 rounded-md text-xs file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#008bdc] file:text-white hover:file:bg-blue-600 file:cursor-pointer hover:border-slate-400 transition-all duration-200"
                  />
                  {resumeFile && (
                    <p className="text-xs text-green-600 mt-1">Selected: {resumeFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                <button
                  onClick={() => setPasswordEdit(!passwordEdit)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-900 transition-all duration-200"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                  {passwordEdit ? "Cancel" : "Update"}
                </button>
              </div>
              
              {passwordEdit ? (
                <form className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-xs">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#008bdc]/50 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-xs">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#008bdc]/50 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordUpdate}
                    className="w-full bg-[#008bdc] text-white py-2.5 rounded-md font-bold hover:bg-blue-600 transition-all duration-200 text-sm"
                  >
                    Update Password
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-white rounded-md border border-slate-200 text-center">
                  <p className="text-slate-500 text-xs">Click Update to change your password</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
