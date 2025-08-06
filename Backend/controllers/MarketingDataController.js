const { MarketingData } = require('../models');
const { Parser } = require('json2csv');

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

  // Export marketing data to CSV
  static async exportData(req, res) {
    try {
      // Apply filters from query parameters
      const whereClause = {};
      
      // ID filter
      if (req.query.id) {
        whereClause.ID = parseInt(req.query.id);
      }
      
      // Education filter
      if (req.query.education) {
        whereClause.Education = req.query.education;
      }
      
      // Marital Status filter
      if (req.query.maritalStatus) {
        whereClause.Marital_Status = req.query.maritalStatus;
      }
      
      // Date range filter for Dt_Customer
      if (req.query.startDate && req.query.endDate) {
        whereClause.Dt_Customer = {
          [MarketingData.sequelize.Op.between]: [
            req.query.startDate,
            req.query.endDate
          ]
        };
      } else if (req.query.startDate) {
        whereClause.Dt_Customer = {
          [MarketingData.sequelize.Op.gte]: req.query.startDate
        };
      } else if (req.query.endDate) {
        whereClause.Dt_Customer = {
          [MarketingData.sequelize.Op.lte]: req.query.endDate
        };
      }
      
      // Sort options
      const sortField = req.query.sortBy || 'ID';
      const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      
      // Get filtered marketing data
      const data = await MarketingData.findAll({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        order: [[sortField, sortOrder]],
        raw: false
      });

      if (!data || data.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No data available for export'
        });
      }

      // Transform data with calculated fields
      const transformedData = data.map(item => {
        const itemJSON = item.toJSON();
        
        // Add calculated fields
        return {
          ID: itemJSON.ID,
          Year_Birth: itemJSON.Year_Birth,
          Age: item.getAge(),
          Education: itemJSON.Education,
          Marital_Status: itemJSON.Marital_Status,
          Income: itemJSON.Income,
          Has_Children: item.hasChildren() ? 'Yes' : 'No',
          Kids: itemJSON.Kidhome,
          Teens: itemJSON.Teenhome,
          Customer_Since: itemJSON.Dt_Customer,
          Days_Since_Last_Purchase: itemJSON.Recency,
          Wine_Purchases: itemJSON.MntWines,
          Fruit_Purchases: itemJSON.MntFruits,
          Meat_Purchases: itemJSON.MntMeatProducts,
          Fish_Purchases: itemJSON.MntFishProducts,
          Sweet_Purchases: itemJSON.MntSweetProducts,
          Gold_Purchases: itemJSON.MntGoldProds,
          Total_Spent: item.getTotalSpent(),
          Deal_Purchases: itemJSON.NumDealsPurchases,
          Web_Purchases: itemJSON.NumWebPurchases,
          Catalog_Purchases: itemJSON.NumCatalogPurchases,
          Store_Purchases: itemJSON.NumStorePurchases,
          Web_Visits_Per_Month: itemJSON.NumWebVisitsMonth,
          Total_Purchases: item.getTotalPurchases(),
          Accepted_Campaign_1: itemJSON.AcceptedCmp1 ? 'Yes' : 'No',
          Accepted_Campaign_2: itemJSON.AcceptedCmp2 ? 'Yes' : 'No',
          Accepted_Campaign_3: itemJSON.AcceptedCmp3 ? 'Yes' : 'No',
          Accepted_Campaign_4: itemJSON.AcceptedCmp4 ? 'Yes' : 'No',
          Accepted_Campaign_5: itemJSON.AcceptedCmp5 ? 'Yes' : 'No',
          Total_Campaigns_Accepted: item.getTotalCampaignsAccepted(),
          Complaint: itemJSON.Complain ? 'Yes' : 'No',
          Last_Campaign_Response: itemJSON.Response ? 'Yes' : 'No'
        };
      });

      // Configure CSV Parser with custom fields and options
      const fields = Object.keys(transformedData[0]);
      const opts = { 
        fields,
        delimiter: ',',
        quote: '"',
        header: true,
        includeEmptyRows: false
      };
      const parser = new Parser(opts);

      // Convert to CSV
      const csv = parser.parse(transformedData);

      // Set response headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=marketing-data-export-${new Date().toISOString().slice(0,10)}.csv`);

      // Send the CSV file
      res.send(csv);
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export data',
        details: error.message
      });
    }
  }
}

module.exports = MarketingDataController;
