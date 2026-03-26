const express = require('express');
const { createProgram, getPrograms, updateProgram } = require('../controllers/programController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'dean'), createProgram);
router.get('/', authMiddleware, getPrograms);
router.put('/:programId', authMiddleware, roleMiddleware('admin', 'dean'), updateProgram);

module.exports = router;
