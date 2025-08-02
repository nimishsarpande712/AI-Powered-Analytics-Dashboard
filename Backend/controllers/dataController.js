const { MarketingData } = require('../models');

class DataController {
  // Get marketing data - basic function that returns first 10 records
  static async getMarketingData(req, res) {
    try {
      const data = await MarketingData.findAll({ 
        limit: 10 
      });

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error fetching marketing data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch marketing data' 
      });
    }
  }
}

module.exports = DataController;
