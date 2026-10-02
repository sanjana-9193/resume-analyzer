import { useState } from "react";
import api from "../api/axios.js";

const RewriteSuggestions = ({ analysisId }) => {
  const [rewrites, setRewrites] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRewrite = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/resume/${analysisId}/rewrite`);
      setRewrites(res.data.rewrites);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate rewrite suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          ✍️ AI Bullet Point Rewrites
        </h3>
        {!rewrites && (
          <button
            onClick={handleRewrite}
            disabled={loading}
            className="text-sm bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-md transition"
          >
            {loading ? "Generating..." : "Generate Rewrites"}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {rewrites && (
        <div className="space-y-4">
          {rewrites.map((r, i) => (
            <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Original</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-through decoration-gray-300">
                {r.original}
              </p>
              <p className="text-xs text-green-600 mb-1">Improved</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{r.improved}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewriteSuggestions;
