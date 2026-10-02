import { useState } from "react";
import api from "../api/axios.js";
import jsPDF from "jspdf";

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition";

const downloadResumePDF = (resume, fullName) => {
  const doc = new jsPDF();
  const margin = 15;
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;

  const addWrapped = (text, fontSize = 10.5, gapAfter = 4) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += fontSize * 0.5;
    });
    y += gapAfter;
  };

  const sectionHeader = (title) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont(undefined, "bold");
    doc.setFontSize(13);
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
    doc.setFont(undefined, "normal");
  };

  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text(fullName || "Resume", margin, y);
  y += 10;
  doc.setFont(undefined, "normal");

  if (resume.summary) {
    sectionHeader("Summary");
    addWrapped(resume.summary, 10.5, 6);
  }

  if (resume.skills?.length) {
    sectionHeader("Skills");
    addWrapped(resume.skills.join(" • "), 10.5, 6);
  }

  if (resume.experience?.length) {
    sectionHeader("Experience");
    resume.experience.forEach((exp) => {
      doc.setFont(undefined, "bold");
      doc.setFontSize(11);
      doc.text(`${exp.title || ""}${exp.company ? " — " + exp.company : ""}`, margin, y);
      y += 5;
      doc.setFont(undefined, "italic");
      doc.setFontSize(9.5);
      if (exp.duration) {
        doc.text(exp.duration, margin, y);
        y += 5;
      }
      doc.setFont(undefined, "normal");
      (exp.bullets || []).forEach((b) => addWrapped(`• ${b}`, 10, 2));
      y += 3;
    });
  }

  if (resume.projects?.length) {
    sectionHeader("Projects");
    resume.projects.forEach((p) => {
      doc.setFont(undefined, "bold");
      doc.setFontSize(11);
      doc.text(p.name || "", margin, y);
      y += 5;
      doc.setFont(undefined, "normal");
      (p.bullets || []).forEach((b) => addWrapped(`• ${b}`, 10, 2));
      y += 3;
    });
  }

  if (resume.education?.length) {
    sectionHeader("Education");
    resume.education.forEach((ed) => {
      addWrapped(
        `${ed.degree || ""}${ed.institution ? ", " + ed.institution : ""}${ed.year ? " (" + ed.year + ")" : ""}`,
        10.5,
        3
      );
    });
  }

  const safeName = (fullName || "resume").replace(/[^a-z0-9]/gi, "_");
  doc.save(`${safeName}-ai-resume.pdf`);
};

const BuildResume = () => {
  const [form, setForm] = useState({
    fullName: "",
    targetRole: "",
    education: "",
    skills: "",
    experience: "",
    projects: "",
    jobDescription: "",
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const hasAny = [form.education, form.skills, form.experience, form.projects].some(
      (v) => v.trim().length > 5
    );
    if (!hasAny) {
      setError("Please fill in at least one section (education, skills, experience, or projects)");
      return;
    }

    try {
      setLoading(true);
      setResume(null);
      const res = await api.post("/resume/build", form);
      setResume(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6"
      >
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
          📝 Build Your Resume with AI
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Write your details in your own words below — AI will turn them into polished,
          ATS-friendly resume content. Fill at least one section.
        </p>

        <Field label="Full Name">
          <input className={inputClass} value={form.fullName} onChange={update("fullName")} placeholder="Jane Doe" />
        </Field>

        <Field label="Target Role (optional)">
          <input
            className={inputClass}
            value={form.targetRole}
            onChange={update("targetRole")}
            placeholder="e.g. Frontend Developer"
          />
        </Field>

        <Field label="Education">
          <textarea
            className={inputClass}
            rows={3}
            value={form.education}
            onChange={update("education")}
            placeholder="e.g. B.Tech in Computer Science, XYZ University, 2022-2026"
          />
        </Field>

        <Field label="Skills (comma separated)">
          <textarea
            className={inputClass}
            rows={2}
            value={form.skills}
            onChange={update("skills")}
            placeholder="e.g. React, JavaScript, Node.js, MongoDB, Git"
          />
        </Field>

        <Field label="Experience / Internships">
          <textarea
            className={inputClass}
            rows={4}
            value={form.experience}
            onChange={update("experience")}
            placeholder="Describe your work/internship experience in your own words — role, company, what you did"
          />
        </Field>

        <Field label="Projects">
          <textarea
            className={inputClass}
            rows={4}
            value={form.projects}
            onChange={update("projects")}
            placeholder="Describe your projects — what you built, tech used, outcome"
          />
        </Field>

        <Field label="Target Job Description (optional, for tailoring)">
          <textarea
            className={inputClass}
            rows={3}
            value={form.jobDescription}
            onChange={update("jobDescription")}
            placeholder="Paste a job description to tailor the resume toward it"
          />
        </Field>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:opacity-90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition shadow-soft"
        >
          {loading ? "Generating Resume..." : "✨ Generate Resume"}
        </button>
      </form>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
        {!resume ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm py-20 text-center px-6">
            Fill the form and click "Generate Resume" — your AI-written resume will appear here.
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-gray-800 dark:text-gray-100">
                {form.fullName || "Your Resume"}
              </h3>
              <button
                onClick={() => downloadResumePDF(resume, form.fullName)}
                className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md transition"
              >
                ⬇️ Download PDF
              </button>
            </div>

            {resume.summary && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Summary</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{resume.summary}</p>
              </div>
            )}

            {resume.skills?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resume.experience?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Experience</p>
                {resume.experience.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {exp.title} {exp.company && `— ${exp.company}`}
                    </p>
                    {exp.duration && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-1">{exp.duration}</p>
                    )}
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                      {exp.bullets?.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {resume.projects?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Projects</p>
                {resume.projects.map((p, i) => (
                  <div key={i} className="mb-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{p.name}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                      {p.bullets?.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {resume.education?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Education</p>
                {resume.education.map((ed, i) => (
                  <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                    {ed.degree}
                    {ed.institution && `, ${ed.institution}`}
                    {ed.year && ` (${ed.year})`}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildResume;
