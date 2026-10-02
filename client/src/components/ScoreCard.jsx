const getColor = (score) => {
  if (score >= 75) return "text-green-600 border-green-500";
  if (score >= 50) return "text-yellow-600 border-yellow-500";
  return "text-red-600 border-red-500";
};

const ScoreCard = ({ score, summary }) => {
  const colorClass = getColor(score);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center">
      <div
        className={`w-28 h-28 rounded-full border-8 flex items-center justify-center text-3xl font-bold ${colorClass}`}
      >
        {score}
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Match Score / 100</p>
      {summary && <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{summary}</p>}
    </div>
  );
};

export default ScoreCard;
