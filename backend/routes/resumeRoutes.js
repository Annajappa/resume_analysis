const express = require('express');
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/api//upload', upload.single('resume'), resumeController.uploadResume);
router.get('/api/', resumeController.getAllResumes);
router.get('api/:id', resumeController.getResumeById);

module.exports = router;
