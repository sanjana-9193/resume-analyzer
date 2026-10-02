import { useState, useEffect } from "react";
import UploadForm from "../components/UploadForm.jsx";
import ScoreCard from "../components/ScoreCard.jsx";
import SuggestionsList from "../components/SuggestionsList.jsx";
import History from "../components/History.jsx";
import ScoreHistoryChart from "../components/ScoreHistoryChart.jsx";
import RewriteSuggestions from "../components/RewriteSuggestions.jsx";
import CompareResumes from "../components/CompareResumes.jsx";
import BuildResume from "../components/BuildResume.jsx";
import { downloadAnalysisPDF } from "../utils/pdfExport.js";
import api from "../api/axios.js";

const Dashboard = () => {
  const [result, setResult] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fullHistory, setFullHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("analyze"); // "analyze" | "compare"

  const handleResult = (data) => {
    setResult(data);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    api
      .get("/resume/history")
      .then((res) => setFullHistory(res.data))
      .catch(() => {});
  }, [refreshKey]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        AI Resume Analyzer
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm max-w-2xl">
        Upload your resume and paste a job description to get an instant match score, missing
        keywords, and improvement suggestions.
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("analyze")}
          className={`text-sm px-4 py-2 rounded-full font-medium transition ${
            activeTab === "analyze"
              ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-soft"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300"
          }`}
        >
          Analyze One
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          className={`text-sm px-4 py-2 rounded-full font-medium transition ${
            activeTab === "compare"
              ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-soft"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300"
          }`}
        >
          Compare Multiple
        </button>
        <button
          onClick={() => setActiveTab("build")}
          className={`text-sm px-4 py-2 rounded-full font-medium transition ${
            activeTab === "build"
              ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-soft"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300"
          }`}
        >
          ✨ Build Resume
        </button>
      </div>

      {activeTab === "compare" ? (
        <CompareResumes />
      ) : activeTab === "build" ? (
        <BuildResume />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UploadForm onResult={handleResult} />

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Past Analyses</h2>
              <History onSelect={setResult} refreshKey={refreshKey} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <ScoreHistoryChart history={fullHistory} />

            {result ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <ScoreCard score={result.matchScore} summary={result.summary} />
                    <button
                      onClick={() => downloadAnalysisPDF(result)}
                      className="w-full mt-3 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 rounded-md transition"
                    >
                      ⬇️ Download PDF Report
                    </button>
                  </div>
                  <div className="md:col-span-2">
                    <SuggestionsList
                      missingKeywords={result.missingKeywords}
                      strengths={result.strengths}
                      suggestions={result.suggestions}
                    />
                  </div>
                </div>

                <RewriteSuggestions analysisId={result._id} />
              </>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500 text-sm py-20">
                Upload a resume to see your analysis here
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
