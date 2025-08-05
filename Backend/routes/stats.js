const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/statisticsController');

// Route to get dashboard statistics
router.get('/', StatisticsController.getDashboardStats);

module.exports = router;
