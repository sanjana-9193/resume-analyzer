/**
 * Sends resume text + job description to the Google Gemini API (free tier) and
 * asks for a structured JSON analysis: match score, missing keywords, strengths, suggestions.
 */
const buildPrompt = (resumeText, jobDescription) => `
You are an expert ATS (Applicant Tracking System) and career coach.

Compare the RESUME below against the JOB DESCRIPTION and return ONLY a valid JSON object
(no markdown, no backticks, no preamble) with exactly this shape:

{
  "matchScore": <integer 0-100, how well the resume matches the job description>,
  "missingKeywords": [<important skills/keywords from the JD missing in the resume>],
  "strengths": [<3-5 short bullet points on what the resume does well for this JD>],
  "suggestions": [<3-6 short, actionable bullet points to improve the resume for this JD>],
  "summary": <one short paragraph, 2-3 sentences, overall verdict>
}

RESUME:
"""
${resumeText.slice(0, 12000)}
"""

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 6000)}
"""

Return ONLY the JSON object.
`;

/**
 * Calls Gemini with strong retry logic: up to 5 attempts with exponential
 * backoff (2s, 4s, 8s, 16s) whenever the model reports it's overloaded (503)
 * or a transient network error occurs.
 */
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the server .env file");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const maxRetries = 5;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      });

      // Retry on overload (503) or rate-limit (429)
      if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
        const waitMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s, 16s
        console.log(`Gemini busy (status ${response.status}), retrying in ${waitMs / 1000}s... (attempt ${attempt}/${maxRetries})`);
        await new Promise((res) => setTimeout(res, waitMs));
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${errText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text response from AI");
      return text;
    } catch (err) {
      lastError = err;
      // Retry on network-level errors too (e.g. fetch failed, timeout)
      if (attempt < maxRetries) {
        const waitMs = Math.pow(2, attempt) * 1000;
        console.log(`Gemini request failed (${err.message}), retrying in ${waitMs / 1000}s... (attempt ${attempt}/${maxRetries})`);
        await new Promise((res) => setTimeout(res, waitMs));
        continue;
      }
      throw lastError;
    }
  }

  throw lastError || new Error("Gemini API failed after all retry attempts");
};

/**
 * Generates AI-rewritten, improved versions of weak resume bullet points,
 * tailored to the job description.
 */
export const rewriteResumeBullets = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert resume writer. Given the RESUME and JOB DESCRIPTION below,
pick the 5 most important bullet points/lines from the resume's experience or
projects sections that could be improved, and rewrite each to be more impactful,
quantified, and tailored to the job description.

Return ONLY a valid JSON array (no markdown, no backticks) with this shape:
[
  { "original": "<original line from resume>", "improved": "<rewritten, stronger version>" }
]

RESUME:
"""
${resumeText.slice(0, 12000)}
"""

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 6000)}
"""

Return ONLY the JSON array.
`;

  const text = await callGemini(prompt);
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse AI rewrite response: " + cleaned.slice(0, 300));
  }
};

/**
 * Generates a full, structured, ATS-friendly resume from raw user-provided
 * details (education, skills, experience, projects), optionally tailored to
 * a target job description.
 */
export const generateResume = async (details) => {
  const { fullName, targetRole, education, skills, experience, projects, jobDescription } = details;

  const prompt = `
You are an expert resume writer. Using the RAW DETAILS below (provided by the
candidate in their own words), write a polished, ATS-friendly resume.

Rewrite everything into strong, quantified, action-verb-led bullet points.
Fix grammar. Keep it realistic — do not invent companies, degrees, or facts
that are not implied by the raw details. If a section has no raw details,
return an empty array for it.

${jobDescription ? `Tailor the wording toward this TARGET JOB DESCRIPTION:\n"""\n${jobDescription.slice(0, 4000)}\n"""\n` : ""}

Return ONLY a valid JSON object (no markdown, no backticks) with exactly this shape:
{
  "summary": "<2-3 sentence professional summary>",
  "skills": ["<skill1>", "<skill2>", ...],
  "experience": [
    { "title": "<job title>", "company": "<company>", "duration": "<e.g. Jan 2023 - Present>", "bullets": ["<bullet1>", "<bullet2>"] }
  ],
  "education": [
    { "degree": "<degree>", "institution": "<institution>", "year": "<year or range>" }
  ],
  "projects": [
    { "name": "<project name>", "bullets": ["<bullet1>", "<bullet2>"] }
  ]
}

CANDIDATE NAME: ${fullName || "Not provided"}
TARGET ROLE: ${targetRole || "Not specified"}

RAW EDUCATION DETAILS:
"""
${education || "None provided"}
"""

RAW SKILLS:
"""
${skills || "None provided"}
"""

RAW EXPERIENCE DETAILS:
"""
${experience || "None provided"}
"""

RAW PROJECTS:
"""
${projects || "None provided"}
"""

Return ONLY the JSON object.
`;

  const text = await callGemini(prompt);
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse AI resume response: " + cleaned.slice(0, 300));
  }
};

export const analyzeResume = async (resumeText, jobDescription) => {
  const text = await callGemini(buildPrompt(resumeText, jobDescription));
  const cleaned = text.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON: " + cleaned.slice(0, 300));
  }

  return {
    matchScore: Number(parsed.matchScore) || 0,
    missingKeywords: parsed.missingKeywords || [],
    strengths: parsed.strengths || [],
    suggestions: parsed.suggestions || [],
    summary: parsed.summary || "",
  };
};
