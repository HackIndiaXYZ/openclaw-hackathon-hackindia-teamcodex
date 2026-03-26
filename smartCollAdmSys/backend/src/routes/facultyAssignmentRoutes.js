const express = require('express');
const {
    createFacultyAssignment,
    getFacultyAssignments,
    getMyFacultyAssignments,
    updateFacultyAssignment
} = require('../controllers/facultyAssignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'dean'), createFacultyAssignment);
router.get('/', authMiddleware, roleMiddleware('admin', 'dean'), getFacultyAssignments);
router.get('/my', authMiddleware, roleMiddleware('professor', 'admin', 'dean'), getMyFacultyAssignments);
router.put('/:assignmentId', authMiddleware, roleMiddleware('admin', 'dean'), updateFacultyAssignment);

module.exports = router;
