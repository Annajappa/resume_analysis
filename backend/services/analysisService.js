const db = require("../db"); // make sure you have a db.js that exports sqlite3 connection
const { analyzeResume } = require("../services/analyzeResume");

// Upload & analyze resume, then save to DB
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const analysis = await analyzeResume(req.file.buffer, req.file.originalname);

    // Save into DB
    const sql = `
      INSERT INTO resumes 
      (file_name, name, email, phone, linkedin_url, portfolio_url, summary, work_experience, education, technical_skills, soft_skills, projects, certifications, resume_rating, improvement_areas, upskill_suggestions) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      analysis.file_name,
      analysis.name,
      analysis.email,
      analysis.phone,
      analysis.linkedin_url,
      analysis.portfolio_url,
      analysis.summary,
      JSON.stringify(analysis.work_experience || []),
      JSON.stringify(analysis.education || []),
      JSON.stringify(analysis.technical_skills || []),
      JSON.stringify(analysis.soft_skills || []),
      JSON.stringify(analysis.projects || []),
      JSON.stringify(analysis.certifications || []),
      analysis.resume_rating,
      analysis.improvement_areas,
      JSON.stringify(analysis.upskill_suggestions || [])
    ];

    db.run(sql, values, function (err) {
      if (err) {
        console.error("DB insert error:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res.json({ id: this.lastID, ...analysis });
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all resumes (history)
exports.getAllResumes = (req, res) => {
  db.all("SELECT * FROM resumes ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database fetch failed" });
    }
    res.json(rows);
  });
};

// Fetch one resume by ID
exports.getResumeById = (req, res) => {
  db.get("SELECT * FROM resumes WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database fetch failed" });
    }
    if (!row) return res.status(404).json({ error: "Resume not found" });
    res.json(row);
  });
};

