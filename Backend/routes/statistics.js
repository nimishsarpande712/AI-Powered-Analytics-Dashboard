const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/statisticsController');

// Route to get dashboard statistics
router.get('/dashboard-stats', StatisticsController.getDashboardStats);

// Route to get conversion trends
router.get('/conversion-trends', StatisticsController.getConversionTrends);

module.exports = router;
