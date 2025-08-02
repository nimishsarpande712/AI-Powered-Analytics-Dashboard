const { Campaign, MarketingData } = require('../models');

class DashboardController {
  // Get consolidated dashboard analytics data
  static async getDashboardAnalytics(req, res) {
    try {
      // Fetch campaigns
      const campaigns = await Campaign.findAll();
      
      // Fetch marketing data
      const marketingData = await MarketingData.findAll();
      
      // Return consolidated data
      res.json({
        success: true,
        campaigns,
        marketingData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard analytics data',
        message: error.message 
      });
    }
  }
}

module.exports = DashboardController;
