import { useState } from "react";
import api from "../api/axios.js";

const UploadForm = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a PDF resume");
      return;
    }
    if (jobDescription.trim().length < 20) {
      setError("Please paste a fuller job description (at least a few sentences)");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      const res = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Resume (PDF only, max 5MB)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
        <textarea
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:opacity-90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition shadow-soft"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </form>
  );
};

export default UploadForm;
