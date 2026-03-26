const express = require('express');
const { addMarks, getStudentMarks, getAllMarks } = require('../controllers/marksController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Marks routes let professors store and read academic performance data.
router.post('/', authMiddleware, addMarks);
router.get('/', authMiddleware, getAllMarks);
router.get('/:studentId', authMiddleware, getStudentMarks);

module.exports = router;
