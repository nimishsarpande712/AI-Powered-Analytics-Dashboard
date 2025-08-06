const { Campaign } = require('../models');

class CampaignController {
  // Get all campaigns
  static async getAllCampaigns(req, res) {
    try {
      const campaigns = await Campaign.findAll({
        order: [['startDate', 'DESC']]
      });

      // Add calculated ROI to each campaign
      const campaignsWithROI = campaigns.map(campaign => {
        const campaignData = campaign.toJSON();
        campaignData.roi = campaign.calculateROI();
        campaignData.isActive = campaign.isActive();
        return campaignData;
      });

      res.json({
        success: true,
        data: campaignsWithROI
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch campaigns' 
      });
    }
  }

  // Get active campaigns only
  static async getActiveCampaigns(req, res) {
    try {
      const activeCampaigns = await Campaign.getActiveCampaigns();
      res.json({
        success: true,
        data: activeCampaigns
      });
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch active campaigns' 
      });
    }
  }

  // Get campaign analytics by channel
  static async getChannelAnalytics(req, res) {
    try {
      const analytics = await Campaign.getTotalSpendByChannel();
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching channel analytics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch channel analytics' 
      });
    }
  }

  // Create new campaign
  static async createCampaign(req, res) {
    try {
      const campaign = await Campaign.create(req.body);
      res.status(201).json({
        success: true,
        data: campaign,
        message: 'Campaign created successfully'
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          success: false,
          error: 'Validation error', 
          details: error.errors.map(e => e.message) 
        });
      }
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create campaign' 
      });
    }
  }

  // Get single campaign by ID
  static async getCampaignById(req, res) {
    try {
      const campaign = await Campaign.findByPk(req.params.id);
      if (!campaign) {
        return res.status(404).json({ 
          success: false, 
          error: 'Campaign not found' 
        });
      }
      
      const campaignData = campaign.toJSON();
      campaignData.roi = campaign.calculateROI();
      campaignData.isActive = campaign.isActive();
      
      res.json({
        success: true,
        data: campaignData
      });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch campaign' 
      });
    }
  }

  // Update campaign
  static async updateCampaign(req, res) {
    try {
      const campaign = await Campaign.findByPk(req.params.id);
      if (!campaign) {
        return res.status(404).json({ 
          success: false, 
          error: 'Campaign not found' 
        });
      }
      
      await campaign.update(req.body);
      res.json({
        success: true,
        data: campaign,
        message: 'Campaign updated successfully'
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          success: false,
          error: 'Validation error', 
          details: error.errors.map(e => e.message) 
        });
      }
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update campaign' 
      });
    }
  }

  // Delete campaign
  static async deleteCampaign(req, res) {
    try {
      const campaign = await Campaign.findByPk(req.params.id);
      if (!campaign) {
        return res.status(404).json({ 
          success: false, 
          error: 'Campaign not found' 
        });
      }
      
      await campaign.destroy();
      res.json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete campaign' 
      });
    }
  }

  // Get campaign performance dashboard
  static async getCampaignDashboard(req, res) {
    try {
      const [totalCampaigns, activeCampaigns, channelAnalytics] = await Promise.all([
        Campaign.count(),
        Campaign.count({ where: { status: 'Active' } }),
        Campaign.getTotalSpendByChannel()
      ]);

      // Calculate total spend and revenue
      const totals = await Campaign.findOne({
        attributes: [
          [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('spend')), 'totalSpend'],
          [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('revenue')), 'totalRevenue'],
          [Campaign.sequelize.fn('AVG', Campaign.sequelize.col('spend')), 'avgSpend'],
          [Campaign.sequelize.fn('AVG', Campaign.sequelize.col('revenue')), 'avgRevenue']
        ]
      });

      res.json({
        success: true,
        data: {
          summary: {
            totalCampaigns,
            activeCampaigns,
            completedCampaigns: totalCampaigns - activeCampaigns
          },
          financials: totals,
          channelAnalytics
        }
      });
    } catch (error) {
      console.error('Error fetching campaign dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch campaign dashboard' 
      });
    }
  }

  // Export campaigns data to CSV
  static async exportCsv(req, res) {
    try {
      const { Parser } = require('json2csv');
      
      // Apply filters if provided
      const whereClause = {};
      
      // Status filter
      if (req.query.status) {
        whereClause.status = req.query.status;
      }
      
      // Date range filter for startDate
      if (req.query.startDate && req.query.endDate) {
        whereClause.startDate = {
          [Campaign.sequelize.Op.between]: [
            req.query.startDate,
            req.query.endDate
          ]
        };
      }
      
      // Get all campaign data with filters
      const campaigns = await Campaign.findAll({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        order: [['startDate', 'DESC']]
      });

      if (!campaigns || campaigns.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No campaigns available for export'
        });
      }

      // Transform data with calculated fields
      const transformedData = campaigns.map(campaign => {
        const campaignData = campaign.toJSON();
        return {
          Campaign_Name: campaignData.name,
          Status: campaignData.status,
          Budget: campaignData.budget,
          Spent: campaignData.spent || 0,
          Remaining_Budget: (campaignData.budget || 0) - (campaignData.spent || 0),
          Start_Date: campaignData.startDate,
          End_Date: campaignData.endDate,
          Channel: campaignData.channel,
          Target_Audience: campaignData.targetAudience,
          Impressions: campaignData.impressions || 0,
          Clicks: campaignData.clicks || 0,
          Click_Through_Rate: campaignData.clicks && campaignData.impressions 
            ? ((campaignData.clicks / campaignData.impressions) * 100).toFixed(2) + '%'
            : '0%',
          Conversion_Rate: campaignData.conversionRate ? campaignData.conversionRate + '%' : '0%',
          Cost_Per_Click: campaignData.spent && campaignData.clicks 
            ? '$' + (campaignData.spent / campaignData.clicks).toFixed(2)
            : '$0',
          ROI: campaign.calculateROI() + '%',
          Is_Active: campaign.isActive() ? 'Yes' : 'No',
          Description: campaignData.description || ''
        };
      });

      // Configure CSV Parser
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
      res.setHeader('Content-Disposition', `attachment; filename=campaigns-export-${new Date().toISOString().slice(0,10)}.csv`);

      // Send the CSV file
      res.send(csv);
    } catch (error) {
      console.error('Error exporting campaigns data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export campaigns data',
        details: error.message
      });
    }
  }
}

module.exports = CampaignController;
