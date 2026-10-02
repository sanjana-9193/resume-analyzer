import { useEffect, useState } from "react";
import api from "../api/axios.js";

const History = ({ onSelect, refreshKey }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/resume/history")
      .then((res) => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await api.delete(`/resume/${id}`);
    setHistory((prev) => prev.filter((h) => h._id !== id));
  };

  if (loading) return <p className="text-sm text-gray-400 dark:text-gray-500">Loading history...</p>;
  if (history.length === 0) return <p className="text-sm text-gray-400 dark:text-gray-500">No past analyses yet.</p>;

  return (
    <div className="space-y-2">
      {history.map((h) => (
        <div
          key={h._id}
          onClick={() => onSelect(h)}
          className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex items-center justify-between hover:shadow-soft hover:border-brand-200 dark:hover:border-brand-700 transition"
        >
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{h.resumeFileName}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(h.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-600">{h.matchScore}</span>
            <button
              onClick={(e) => handleDelete(h._id, e)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
