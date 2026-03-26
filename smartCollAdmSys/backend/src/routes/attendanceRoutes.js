const express = require('express');
const {
    addAttendance,
    recognizeAttendance,
    getAttendanceSummary,
    getAttendanceRecords
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Attendance routes save class presence data and return summaries.
router.post('/', authMiddleware, addAttendance);
router.post('/recognize', authMiddleware, upload.single('image'), recognizeAttendance);
router.get('/', authMiddleware, getAttendanceRecords);
router.get('/summary/:studentId', authMiddleware, getAttendanceSummary);

module.exports = router;
