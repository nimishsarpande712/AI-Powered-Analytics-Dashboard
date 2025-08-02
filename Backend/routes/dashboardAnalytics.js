const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

// GET dashboard analytics data
router.get('/', DashboardController.getDashboardAnalytics);

module.exports = router;
