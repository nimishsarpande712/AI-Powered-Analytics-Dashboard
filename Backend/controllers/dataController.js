const { MarketingData } = require('../models');
const { Op } = require('sequelize');

class DataController {
  // Get marketing data with advanced filtering, sorting, and pagination
  static async getMarketingData(req, res) {
    try {
      // Extract query parameters with defaults
      const {
        page = 1,
        limit = 10,
        sort = 'ID',
        order = 'ASC',
        search = '',
        education,
        maritalStatus,
        startDate,
        endDate
      } = req.query;

      // Calculate offset for pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Build where clause dynamically
      const whereClause = {};
      
      // Add search filter for customer ID if provided
      if (search) {
        whereClause.ID = { [Op.like]: `%${search}%` };
      }
      
      // Add education filter if provided
      if (education) {
        whereClause.Education = education;
      }
      
      // Add marital status filter if provided
      if (maritalStatus) {
        whereClause.Marital_Status = maritalStatus;
      }
      
      // Add date range filter if both dates are provided
      if (startDate && endDate) {
        whereClause.Dt_Customer = { 
          [Op.between]: [startDate, endDate] 
        };
      }
      
      // Use findAndCountAll for efficient pagination and total count
      const result = await MarketingData.findAndCountAll({
        where: whereClause,
        order: [[sort, order]],
        limit: parseInt(limit),
        offset: offset
      });

      // Return paginated data with metadata
      res.json({
        success: true,
        data: result.rows,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.count / parseInt(limit)),
        totalRecords: result.count,
        meta: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(result.count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching marketing data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch marketing data',
        details: error.message 
      });
    }
  }
}

module.exports = DataController;
