const { MarketingData } = require('../models');

class MarketingDataController {
  // Get all marketing data with pagination
  static async getAllData(req, res) {
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
        success: true,
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
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch marketing data' 
      });
    }
  }

  // Get customer segmentation analytics
  static async getSegmentation(req, res) {
    try {
      const segmentation = await MarketingData.getCustomerSegmentation();
      res.json({
        success: true,
        data: segmentation
      });
    } catch (error) {
      console.error('Error fetching segmentation data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch segmentation data' 
      });
    }
  }

  // Get campaign performance analytics
  static async getCampaignPerformance(req, res) {
    try {
      const performance = await MarketingData.getCampaignPerformance();
      res.json({
        success: true,
        data: performance[0] // Since it returns array with single object
      });
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch campaign performance' 
      });
    }
  }

  // Get top spenders
  static async getTopSpenders(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const topSpenders = await MarketingData.getTopSpenders(limit);
      res.json({
        success: true,
        data: topSpenders
      });
    } catch (error) {
      console.error('Error fetching top spenders:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch top spenders' 
      });
    }
  }

  // Get single customer by ID
  static async getCustomerById(req, res) {
    try {
      const customer = await MarketingData.findByPk(req.params.id);
      if (!customer) {
        return res.status(404).json({ 
          success: false, 
          error: 'Customer not found' 
        });
      }
      
      // Add calculated fields
      const customerData = customer.toJSON();
      customerData.analytics = {
        totalSpent: customer.getTotalSpent(),
        totalPurchases: customer.getTotalPurchases(),
        age: customer.getAge(),
        hasChildren: customer.hasChildren(),
        totalCampaignsAccepted: customer.getTotalCampaignsAccepted()
      };
      
      res.json({
        success: true,
        data: customerData
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch customer' 
      });
    }
  }

  // Get analytics dashboard summary
  static async getDashboardSummary(req, res) {
    try {
      const [totalCustomers, campaignPerformance, topSpenders] = await Promise.all([
        MarketingData.count(),
        MarketingData.getCampaignPerformance(),
        MarketingData.getTopSpenders(5)
      ]);

      // Calculate average metrics
      const avgMetrics = await MarketingData.findOne({
        attributes: [
          [MarketingData.sequelize.fn('AVG', MarketingData.sequelize.col('Income')), 'avgIncome'],
          [MarketingData.sequelize.fn('AVG', MarketingData.sequelize.literal('MntWines + MntFruits + MntMeatProducts + MntFishProducts + MntSweetProducts + MntGoldProds')), 'avgTotalSpent'],
          [MarketingData.sequelize.fn('AVG', MarketingData.sequelize.literal('NumDealsPurchases + NumWebPurchases + NumCatalogPurchases + NumStorePurchases')), 'avgTotalPurchases']
        ]
      });

      res.json({
        success: true,
        data: {
          totalCustomers,
          averages: avgMetrics,
          campaignPerformance: campaignPerformance[0],
          topSpenders
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard summary' 
      });
    }
  }
}

module.exports = MarketingDataController;
