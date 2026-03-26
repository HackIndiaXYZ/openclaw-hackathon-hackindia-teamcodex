const express = require('express');
const { createBatch, getBatches, updateBatch } = require('../controllers/batchController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'dean'), createBatch);
router.get('/', authMiddleware, getBatches);
router.put('/:batchId', authMiddleware, roleMiddleware('admin', 'dean'), updateBatch);

module.exports = router;
