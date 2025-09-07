require('dotenv').config();
const express = require('express');
const cors = require("cors");

app.use(cors({
  origin: "https://resume-analysis-3-1kj4.onrender.com/", // your frontend Render URL
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => res.send('Resume Analyzer API is running'));
app.use('/api/resumes', resumeRoutes);

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
