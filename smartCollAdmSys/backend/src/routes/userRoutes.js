const express = require('express');
const { getUsers, createUser, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin', 'dean'), getUsers);
router.post('/', authMiddleware, roleMiddleware('admin', 'dean'), createUser);
router.put('/:userId', authMiddleware, roleMiddleware('admin', 'dean'), updateUser);

module.exports = router;
