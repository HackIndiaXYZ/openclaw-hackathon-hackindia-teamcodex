const express = require('express');
const { createStudent, getStudents, updateStudent } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', authMiddleware, upload.single('photo'), createStudent);
router.get('/', authMiddleware, getStudents);
router.put('/:studentId', authMiddleware, upload.single('photo'), updateStudent);

module.exports = router;
