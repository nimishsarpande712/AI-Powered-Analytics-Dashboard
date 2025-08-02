const express = require('express');
const router = express.Router();

// Import route modules
const campaignRoutes = require('./campaigns');
const marketingDataRoutes = require('./marketingData');
const dataRoutes = require('./dataRoutes');

// Mount routes
router.use('/campaigns', campaignRoutes);
router.use('/marketing-data', marketingDataRoutes);
router.use('/data', dataRoutes);

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Analytics Dashboard API',
    version: '1.0.0',
    endpoints: {
      campaigns: '/api/campaigns',
      marketingData: '/api/marketing-data',
      data: '/api/data',
      health: '/api/health'
    }
  });
});

module.exports = router;
