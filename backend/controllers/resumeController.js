// backend/controllers/resumeController.js
const { runAsync, getAsync, allAsync } = require('../db');
const { analyzeResume } = require('../services/analysisService');

function toJsonString(value) {
  if (value === null || value === undefined) return null;
  return JSON.stringify(value);
}

function safeParse(jsonStr, fallback) {
  try { return jsonStr ? JSON.parse(jsonStr) : fallback; } catch { return fallback; }
}

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const analysis = await analyzeResume(req.file.buffer, req.file.originalname);

    const sql = `
      INSERT INTO resumes (
        file_name, name, email, phone, linkedin_url, portfolio_url, summary,
        work_experience, education, technical_skills, soft_skills, projects, certifications,
        resume_rating, improvement_areas, upskill_suggestions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      analysis.file_name,
      analysis.name || null,
      analysis.email || null,
      analysis.phone || null,
      analysis.linkedin_url || null,
      analysis.portfolio_url || null,
      analysis.summary || null,
      toJsonString(analysis.work_experience || []),
      toJsonString(analysis.education || []),
      toJsonString(analysis.technical_skills || []),
      toJsonString(analysis.soft_skills || []),
      toJsonString(analysis.projects || []),
      toJsonString(analysis.certifications || []),
      Number.isFinite(analysis.resume_rating) ? analysis.resume_rating : null,
      analysis.improvement_areas || null,
      toJsonString(analysis.upskill_suggestions || [])
    ];

    const { lastID } = await runAsync(sql, params);
    const row = await getAsync('SELECT * FROM resumes WHERE id = ?', [lastID]);

    // Parse JSON strings back
    const response = {
      ...row,
      work_experience: safeParse(row.work_experience, []),
      education: safeParse(row.education, []),
      technical_skills: safeParse(row.technical_skills, []),
      soft_skills: safeParse(row.soft_skills, []),
      projects: safeParse(row.projects, []),
      certifications: safeParse(row.certifications, []),
      upskill_suggestions: safeParse(row.upskill_suggestions, [])
    };

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    const msg = err?.message || 'Upload failed';
    res.status(500).json({ error: msg });
  }
};

exports.getAllResumes = async (_req, res) => {
  try {
    const rows = await allAsync(
      `SELECT id, file_name, uploaded_at, name, email, phone, resume_rating
       FROM resumes ORDER BY datetime(uploaded_at) DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const row = await getAsync('SELECT * FROM resumes WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });

    const response = {
      ...row,
      work_experience: safeParse(row.work_experience, []),
      education: safeParse(row.education, []),
      technical_skills: safeParse(row.technical_skills, []),
      soft_skills: safeParse(row.soft_skills, []),
      projects: safeParse(row.projects, []),
      certifications: safeParse(row.certifications, []),
      upskill_suggestions: safeParse(row.upskill_suggestions, [])
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
};
