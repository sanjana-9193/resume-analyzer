import fs from "fs";
import Analysis from "../models/Analysis.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { analyzeResume, rewriteResumeBullets, generateResume } from "../utils/aiAnalyzer.js";

export const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF file is required" });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ message: "Please provide a fuller job description" });
    }

    const resumeText = await extractTextFromPDF(req.file.path);

    if (!resumeText || resumeText.trim().length < 30) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Could not extract text from this PDF" });
    }

    const result = await analyzeResume(resumeText, jobDescription);

    const analysis = await Analysis.create({
      user: req.userId,
      resumeFileName: req.file.originalname,
      resumeText,
      jobDescription,
      matchScore: result.matchScore,
      missingKeywords: result.missingKeywords,
      strengths: result.strengths,
      suggestions: result.suggestions,
      summary: result.summary,
    });

    // clean up uploaded file after processing
    fs.unlink(req.file.path, () => {});

    res.status(201).json(analysis);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ message: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.userId });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Builds a brand-new structured resume from raw user-provided details
export const buildResume = async (req, res) => {
  try {
    const { fullName, targetRole, education, skills, experience, projects, jobDescription } = req.body;

    const hasAnyDetail = [education, skills, experience, projects].some(
      (v) => v && v.trim().length > 5
    );
    if (!hasAnyDetail) {
      return res.status(400).json({
        message: "Please fill in at least one section (education, skills, experience, or projects)",
      });
    }

    const resume = await generateResume({
      fullName,
      targetRole,
      education,
      skills,
      experience,
      projects,
      jobDescription,
    });

    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generates AI-rewritten, stronger versions of weak bullet points for a past analysis
export const rewriteBullets = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.userId });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    if (!analysis.resumeText) {
      return res.status(400).json({ message: "Original resume text not available for this analysis" });
    }

    const rewrites = await rewriteResumeBullets(analysis.resumeText, analysis.jobDescription);
    res.json({ rewrites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accepts multiple resume PDFs + one job description, analyzes each, returns results sorted by score
export const compareResumes = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: "Please upload at least 2 resumes to compare" });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      req.files.forEach((f) => fs.unlink(f.path, () => {}));
      return res.status(400).json({ message: "Please provide a fuller job description" });
    }

    const results = [];

    for (const file of req.files) {
      try {
        const text = await extractTextFromPDF(file.path);
        if (!text || text.trim().length < 30) {
          results.push({ fileName: file.originalname, error: "Could not extract text from this PDF" });
          continue;
        }
        const result = await analyzeResume(text, jobDescription);
        results.push({ fileName: file.originalname, ...result });
      } catch (err) {
        results.push({ fileName: file.originalname, error: err.message });
      } finally {
        fs.unlink(file.path, () => {});
      }
    }

    results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    res.json({ results });
  } catch (err) {
    if (req.files) req.files.forEach((f) => fs.unlink(f.path, () => {}));
    res.status(500).json({ message: err.message });
  }
};
