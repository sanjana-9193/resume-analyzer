import { useState } from "react";
import api from "../api/axios.js";

const CompareResumes = () => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (files.length < 2) {
      setError("Please select at least 2 resume PDFs to compare");
      return;
    }
    if (jobDescription.trim().length < 20) {
      setError("Please paste a fuller job description");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("resumes", f));
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      setResults(null);
      const res = await api.post("/resume/compare", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        🆚 Compare Multiple Resumes
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resumes (select 2-5 PDFs)
          </label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Description
          </label>
          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:opacity-90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition shadow-soft"
        >
          {loading ? "Comparing..." : "Compare Resumes"}
        </button>
      </form>

      {results && (
        <div className="mt-6 space-y-3">
          {results.map((r, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 ${
                i === 0 && !r.error
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700"
                  : "border-gray-100 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {i === 0 && !r.error && "🏆 "}
                  {r.fileName}
                </p>
                {!r.error && (
                  <span className="text-lg font-bold text-brand-600">{r.matchScore}</span>
                )}
              </div>
              {r.error ? (
                <p className="text-xs text-red-500 mt-1">{r.error}</p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompareResumes;
