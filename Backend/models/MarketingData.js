const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MarketingData = sequelize.define('marketing_data', {
    ID: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false
    },
    Year_Birth: { 
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Education: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    Marital_Status: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    Income: { 
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Kidhome: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    Teenhome: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    Dt_Customer: { 
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    Recency: { 
        type: DataTypes.INTEGER,
        allowNull: true
    },
    MntWines: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    MntFruits: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    MntMeatProducts: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    MntFishProducts: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    MntSweetProducts: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    MntGoldProds: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    NumDealsPurchases: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    NumWebPurchases: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    NumCatalogPurchases: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    NumStorePurchases: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    NumWebVisitsMonth: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    AcceptedCmp3: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    AcceptedCmp4: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    AcceptedCmp5: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    AcceptedCmp1: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    AcceptedCmp2: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    Complain: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    Z_CostContact: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3
    },
    Z_Revenue: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 11
    },
    Response: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: 'Response to the last campaign'
    }
}, { 
    timestamps: false,
    tableName: 'marketing_data',
    indexes: [
        {
            fields: ['Education']
        },
        {
            fields: ['Marital_Status']
        },
        {
            fields: ['Response']
        },
        {
            fields: ['Dt_Customer']
        }
    ]
});

// Instance methods for analytics
MarketingData.prototype.getTotalSpent = function() {
    return (this.MntWines || 0) + 
           (this.MntFruits || 0) + 
           (this.MntMeatProducts || 0) + 
           (this.MntFishProducts || 0) + 
           (this.MntSweetProducts || 0) + 
           (this.MntGoldProds || 0);
};

MarketingData.prototype.getTotalPurchases = function() {
    return (this.NumDealsPurchases || 0) + 
           (this.NumWebPurchases || 0) + 
           (this.NumCatalogPurchases || 0) + 
           (this.NumStorePurchases || 0);
};

MarketingData.prototype.getAge = function() {
    if (!this.Year_Birth) return null;
    return new Date().getFullYear() - this.Year_Birth;
};

MarketingData.prototype.hasChildren = function() {
    return (this.Kidhome || 0) > 0 || (this.Teenhome || 0) > 0;
};

MarketingData.prototype.getTotalCampaignsAccepted = function() {
    return (this.AcceptedCmp1 ? 1 : 0) + 
           (this.AcceptedCmp2 ? 1 : 0) + 
           (this.AcceptedCmp3 ? 1 : 0) + 
           (this.AcceptedCmp4 ? 1 : 0) + 
           (this.AcceptedCmp5 ? 1 : 0);
};

// Class methods for analytics
MarketingData.getCustomerSegmentation = function() {
    return this.findAll({
        attributes: [
            'Education',
            'Marital_Status',
            [sequelize.fn('COUNT', sequelize.col('ID')), 'customerCount'],
            [sequelize.fn('AVG', sequelize.col('Income')), 'avgIncome'],
            [sequelize.fn('SUM', sequelize.literal('MntWines + MntFruits + MntMeatProducts + MntFishProducts + MntSweetProducts + MntGoldProds')), 'totalSpent']
        ],
        group: ['Education', 'Marital_Status']
    });
};

MarketingData.getCampaignPerformance = function() {
    return this.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('AcceptedCmp1')), 'Campaign1_Accepted'],
            [sequelize.fn('SUM', sequelize.col('AcceptedCmp2')), 'Campaign2_Accepted'],
            [sequelize.fn('SUM', sequelize.col('AcceptedCmp3')), 'Campaign3_Accepted'],
            [sequelize.fn('SUM', sequelize.col('AcceptedCmp4')), 'Campaign4_Accepted'],
            [sequelize.fn('SUM', sequelize.col('AcceptedCmp5')), 'Campaign5_Accepted'],
            [sequelize.fn('SUM', sequelize.col('Response')), 'LastCampaign_Responses'],
            [sequelize.fn('COUNT', sequelize.col('ID')), 'totalCustomers']
        ]
    });
};

MarketingData.getTopSpenders = function(limit = 10) {
    return this.findAll({
        attributes: [
            'ID',
            'Education',
            'Marital_Status',
            'Income',
            [sequelize.literal('MntWines + MntFruits + MntMeatProducts + MntFishProducts + MntSweetProducts + MntGoldProds'), 'totalSpent']
        ],
        order: [[sequelize.literal('totalSpent'), 'DESC']],
        limit: limit
    });
};

module.exports = MarketingData;
