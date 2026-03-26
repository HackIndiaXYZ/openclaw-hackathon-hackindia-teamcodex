const express = require('express');
const { getAlerts } = require('../controllers/alertsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// This route returns active alerts, mainly for attendance shortage for now.
router.get('/', authMiddleware, getAlerts);

module.exports = router;
