import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import protect from "../middleware/auth.js";
import {
  uploadAndAnalyze,
  getHistory,
  getAnalysisById,
  deleteAnalysis,
  rewriteBullets,
  compareResumes,
  buildResume,
} from "../controllers/resumeController.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.post("/analyze", protect, upload.single("resume"), uploadAndAnalyze);
router.post("/compare", protect, upload.array("resumes", 5), compareResumes);
router.post("/build", protect, buildResume);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getAnalysisById);
router.post("/:id/rewrite", protect, rewriteBullets);
router.delete("/:id", protect, deleteAnalysis);

export default router;
