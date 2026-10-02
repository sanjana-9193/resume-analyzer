import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeFileName: { type: String, required: true },
    resumeText: { type: String },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, required: true },
    missingKeywords: [{ type: String }],
    strengths: [{ type: String }],
    suggestions: [{ type: String }],
    summary: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
