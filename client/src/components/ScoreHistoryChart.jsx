import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const ScoreHistoryChart = ({ history }) => {
  if (!history || history.length < 2) return null;

  const data = [...history]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((h, i) => ({
      name: `#${i + 1}`,
      score: h.matchScore,
      file: h.resumeFileName,
    }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        📈 Score Trend Over Time
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value}`, "Score"]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.file || label}
          />
          <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreHistoryChart;
