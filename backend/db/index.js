const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data', 'resumes.db');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(DB_PATH);

const createTableSQL = `
CREATE TABLE IF NOT EXISTS resumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  name TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  summary TEXT,
  work_experience TEXT,
  education TEXT,
  technical_skills TEXT,
  soft_skills TEXT,
  projects TEXT,
  certifications TEXT,
  resume_rating INTEGER,
  improvement_areas TEXT,
  upskill_suggestions TEXT
);
`;

db.serialize(() => {
  db.run(createTableSQL);
});

// Promise helpers
const runAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

const getAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const allAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

module.exports = { db, runAsync, getAsync, allAsync };
