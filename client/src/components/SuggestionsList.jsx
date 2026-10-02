const Section = ({ title, items, badgeClass }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-5 last:mb-0">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className={`text-xs px-3 py-1.5 rounded-full ${badgeClass}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const SuggestionsList = ({ missingKeywords, strengths, suggestions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
      <Section
        title="⚠️ Missing Keywords"
        items={missingKeywords}
        badgeClass="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      />
      <Section
        title="✅ Strengths"
        items={strengths}
        badgeClass="bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      />
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">💡 Suggestions</h3>
        <ul className="space-y-2">
          {suggestions?.map((s, i) => (
            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
              <span className="text-brand-600">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuggestionsList;
