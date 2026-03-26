const express = require('express');
const { generateReport, getStudentReports, getAllReports } = require('../controllers/reportsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Report routes generate and fetch bilingual academic comments.
router.get('/', authMiddleware, getAllReports);
router.post('/generate/:studentId', authMiddleware, generateReport);
router.get('/:studentId', authMiddleware, getStudentReports);

module.exports = router;
