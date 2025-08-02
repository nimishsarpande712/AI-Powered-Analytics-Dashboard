const { MarketingData } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class StatisticsController {
  // Get dashboard statistics with key metrics
  static async getDashboardStats(req, res) {
    try {
      // Calculate key metrics using Sequelize aggregates
      const stats = await MarketingData.findOne({
        attributes: [
          [fn('SUM', col('MntWines')), 'totalWineSpend'],
          [fn('AVG', col('Income')), 'averageIncome'],
          [fn('COUNT', literal('CASE WHEN Response = 1 THEN 1 END')), 'totalConversions'],
          [fn('COUNT', col('ID')), 'totalCustomers'],
          [fn('SUM', col('MntFruits')), 'totalFruitSpend'],
          [fn('SUM', col('MntMeatProducts')), 'totalMeatSpend'],
          [fn('SUM', col('MntFishProducts')), 'totalFishSpend'],
          [fn('SUM', col('MntSweetProducts')), 'totalSweetSpend'],
          [fn('SUM', col('MntGoldProds')), 'totalGoldSpend']
        ],
        raw: true
      });

      // Calculate conversion rate
      const conversionRate = stats.totalCustomers > 0 
        ? (stats.totalConversions / stats.totalCustomers * 100).toFixed(2)
        : 0;

      // Calculate total spend across all categories
      const totalSpend = (
        parseFloat(stats.totalWineSpend || 0) +
        parseFloat(stats.totalFruitSpend || 0) +
        parseFloat(stats.totalMeatSpend || 0) +
        parseFloat(stats.totalFishSpend || 0) +
        parseFloat(stats.totalSweetSpend || 0) +
        parseFloat(stats.totalGoldSpend || 0)
      );

      // Get additional demographic insights
      const educationStats = await MarketingData.findAll({
        attributes: [
          'Education',
          [fn('COUNT', col('ID')), 'count'],
          [fn('AVG', col('Income')), 'avgIncome']
        ],
        group: ['Education'],
        raw: true
      });

      const maritalStatusStats = await MarketingData.findAll({
        attributes: [
          'Marital_Status',
          [fn('COUNT', col('ID')), 'count'],
          [fn('SUM', literal('CASE WHEN Response = 1 THEN 1 ELSE 0 END')), 'conversions']
        ],
        group: ['Marital_Status'],
        raw: true
      });

      // Structure the response with all necessary metadata
      const response = {
        success: true,
        data: {
          keyMetrics: {
            totalWineSpend: parseFloat(stats.totalWineSpend || 0),
            averageIncome: parseFloat(stats.averageIncome || 0).toFixed(2),
            totalConversions: parseInt(stats.totalConversions || 0),
            totalCustomers: parseInt(stats.totalCustomers || 0),
            conversionRate: parseFloat(conversionRate),
            totalSpend: totalSpend
          },
          spendingBreakdown: {
            wines: parseFloat(stats.totalWineSpend || 0),
            fruits: parseFloat(stats.totalFruitSpend || 0),
            meat: parseFloat(stats.totalMeatSpend || 0),
            fish: parseFloat(stats.totalFishSpend || 0),
            sweets: parseFloat(stats.totalSweetSpend || 0),
            gold: parseFloat(stats.totalGoldSpend || 0)
          },
          demographics: {
            education: educationStats,
            maritalStatus: maritalStatusStats
          }
        },
        currentPage: 1,
        totalPages: 1,
        totalRecords: 1,
        meta: {
          generatedAt: new Date().toISOString(),
          dataSource: 'marketing_data'
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard statistics',
        details: error.message,
        currentPage: 1,
        totalPages: 0,
        totalRecords: 0
      });
    }
  }

  // Get conversion trends over time
  static async getConversionTrends(req, res) {
    try {
      const { period = 'month' } = req.query;
      
      let dateFormat;
      switch (period) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-%u';
          break;
        case 'month':
        default:
          dateFormat = '%Y-%m';
          break;
      }

      const trends = await MarketingData.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('Dt_Customer'), dateFormat), 'period'],
          [fn('COUNT', col('ID')), 'totalCustomers'],
          [fn('SUM', literal('CASE WHEN Response = 1 THEN 1 ELSE 0 END')), 'conversions'],
          [fn('AVG', col('Income')), 'averageIncome']
        ],
        where: {
          Dt_Customer: {
            [Op.not]: null
          }
        },
        group: [fn('DATE_FORMAT', col('Dt_Customer'), dateFormat)],
        order: [[fn('DATE_FORMAT', col('Dt_Customer'), dateFormat), 'ASC']],
        raw: true
      });

      // Calculate conversion rates for each period
      const trendsWithRates = trends.map(trend => ({
        ...trend,
        conversionRate: trend.totalCustomers > 0 
          ? (trend.conversions / trend.totalCustomers * 100).toFixed(2)
          : 0
      }));

      res.json({
        success: true,
        data: trendsWithRates,
        currentPage: 1,
        totalPages: 1,
        totalRecords: trendsWithRates.length,
        meta: {
          period: period,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching conversion trends:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch conversion trends',
        details: error.message,
        currentPage: 1,
        totalPages: 0,
        totalRecords: 0
      });
    }
  }
}

module.exports = StatisticsController;
