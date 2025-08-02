const express = require('express');
const router = express.Router();
const { Campaign } = require('../models');

// GET all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      order: [['startDate', 'DESC']]
    });

    // Add calculated ROI to each campaign
    const campaignsWithROI = campaigns.map(campaign => {
      const campaignData = campaign.toJSON();
      campaignData.roi = campaign.calculateROI();
      return campaignData;
    });

    res.json(campaignsWithROI);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET active campaigns only
router.get('/active', async (req, res) => {
  try {
    const activeCampaigns = await Campaign.getActiveCampaigns();
    res.json(activeCampaigns);
  } catch (error) {
    console.error('Error fetching active campaigns:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET campaign analytics by channel
router.get('/analytics/by-channel', async (req, res) => {
  try {
    const analytics = await Campaign.getTotalSpendByChannel();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching channel analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new campaign
router.post('/', async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const campaignData = campaign.toJSON();
    campaignData.roi = campaign.calculateROI();
    campaignData.isActive = campaign.isActive();
    
    res.json(campaignData);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update campaign
router.put('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    await campaign.update(req.body);
    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE campaign
router.delete('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    await campaign.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
