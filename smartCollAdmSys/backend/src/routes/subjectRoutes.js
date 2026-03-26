const express = require('express');
const { createSubject, getSubjects, updateSubject } = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'dean'), createSubject);
router.get('/', authMiddleware, getSubjects);
router.put('/:subjectId', authMiddleware, roleMiddleware('admin', 'dean'), updateSubject);

module.exports = router;
