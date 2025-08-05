const express = require('express');
const router = express.Router();
const { MarketingData } = require('../models');
const MarketingDataController = require('../controllers/MarketingDataController');

// GET all marketing data with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const data = await MarketingData.findAndCountAll({
      limit,
      offset,
      order: [['ID', 'ASC']]
    });

    res.json({
      data: data.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.count / limit),
        totalRecords: data.count,
        recordsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching marketing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET customer segmentation analytics
router.get('/segmentation', async (req, res) => {
  try {
    const segmentation = await MarketingData.getCustomerSegmentation();
    res.json(segmentation);
  } catch (error) {
    console.error('Error fetching segmentation data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET campaign performance analytics
router.get('/campaign-performance', async (req, res) => {
  try {
    const performance = await MarketingData.getCampaignPerformance();
    res.json(performance);
  } catch (error) {
    console.error('Error fetching campaign performance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET top spenders
router.get('/top-spenders', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topSpenders = await MarketingData.getTopSpenders(limit);
    res.json(topSpenders);
  } catch (error) {
    console.error('Error fetching top spenders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await MarketingData.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Add calculated fields
    const customerData = customer.toJSON();
    customerData.totalSpent = customer.getTotalSpent();
    customerData.totalPurchases = customer.getTotalPurchases();
    customerData.age = customer.getAge();
    customerData.hasChildren = customer.hasChildren();
    customerData.totalCampaignsAccepted = customer.getTotalCampaignsAccepted();
    
    res.json(customerData);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export marketing data to CSV
router.get('/export', MarketingDataController.exportData);

module.exports = router;
