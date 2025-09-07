require('dotenv').config();
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function stripCodeFences(s) {
  if (!s) return s;
  return s.replace(/```json|```/g, '').trim();
}

function extractFirstJson(s) {
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in model output');
  return s.slice(start, end + 1);
}

async function analyzeResume(fileBuffer, fileName) {
  const pdfData = await pdfParse(fileBuffer);
  const resumeText = (pdfData.text || '').trim().slice(0, 100_000); 

  const prompt = `
You are an expert technical recruiter and career coach. Analyze the following resume text and return ONLY a valid JSON object, no extra words, no markdown.

Resume Text:
"""
${resumeText}
"""

JSON Structure (fill everything you can; use null or [] where unknown):
{
  "name": "string|null",
  "email": "string|null",
  "phone": "string|null",
  "linkedin_url": "string|null",
  "portfolio_url": "string|null",
  "summary": "string|null",
  "work_experience": [
    { "role": "string", "company": "string", "duration": "string", "description": ["string"] }
  ],
  "education": [
    { "degree": "string", "institution": "string", "graduation_year": "string" }
  ],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "projects": [{"name":"string","description":"string"}],
  "certifications": ["string"],
  "resume_rating": 7,
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}
  `.trim();

  const gen = await model.generateContent(prompt);
  let text = gen.response.text();
  text = stripCodeFences(text);
  const jsonStr = extractFirstJson(text);

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Failed to parse model JSON. Try a different PDF or adjust prompt.');
  }

  return {
    file_name: fileName,
    ...parsed
  };
}

module.exports = { analyzeResume };
