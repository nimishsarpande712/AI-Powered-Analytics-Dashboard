const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the Campaign model
const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  campaignName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  channel: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Email', 'Social Media', 'Google Ads', 'Facebook Ads', 'Display', 'Content Marketing', 'SEO', 'Other']]
    }
  },
  spend: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      isFloat: true
    }
  },
  revenue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      isFloat: true
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Completed', 'Paused'),
    allowNull: false,
    defaultValue: 'Active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  }
}, {
  // Model options
  tableName: 'campaigns',
  timestamps: true, // Adds createdAt and updatedAt fields
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['channel']
    },
    {
      fields: ['startDate']
    }
  ]
});

// Instance methods
Campaign.prototype.calculateROI = function() {
  if (this.spend === 0) return 0;
  return ((this.revenue - this.spend) / this.spend) * 100;
};

Campaign.prototype.isActive = function() {
  return this.status === 'Active';
};

// Class methods
Campaign.getActiveCampaigns = function() {
  return this.findAll({
    where: {
      status: 'Active'
    }
  });
};

Campaign.getTotalSpendByChannel = function() {
  return this.findAll({
    attributes: [
      'channel',
      [sequelize.fn('SUM', sequelize.col('spend')), 'totalSpend'],
      [sequelize.fn('SUM', sequelize.col('revenue')), 'totalRevenue'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'campaignCount']
    ],
    group: ['channel']
  });
};

module.exports = Campaign;
