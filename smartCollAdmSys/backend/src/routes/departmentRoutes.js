const express = require('express');
const { createDepartment, getDepartments, updateDepartment } = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'dean'), createDepartment);
router.get('/', authMiddleware, getDepartments);
router.put('/:departmentId', authMiddleware, roleMiddleware('admin', 'dean'), updateDepartment);

module.exports = router;
