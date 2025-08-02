/**
 * Database Seeder Script
 * 
 * This script populates the marketing_data table with data from the marketing_campaign.csv file.
 * It skips the first two lines (header and first data row) and parses the remaining rows.
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MarketingData } = require('./models');
const sequelize = require('./config/db');

// Configuration
const CSV_FILE_PATH = path.join(__dirname, 'marketing_campaign.csv');
const CSV_OPTIONS = { 
  separator: ';', 
  from_line: 3, // Skip header and first data row
  skipComments: true,
  // Handle BOM character in CSV header
  mapHeaders: ({ header }) => {
    return header.replace(/^\uFEFF/, '');
  }
};

// Function to transform CSV data to match model fields
const transformCsvData = (row) => {
  return {
    ID: parseInt(row.ID) || null,
    Year_Birth: parseInt(row.Year_Birth) || null,
    Education: row.Education || null,
    Marital_Status: row.Marital_Status || null,
    Income: row.Income ? parseFloat(row.Income.replace(',', '.')) : null, // Handle European number format if present
    Kidhome: parseInt(row.Kidhome) || 0,
    Teenhome: parseInt(row.Teenhome) || 0,
    Dt_Customer: row.Dt_Customer || null,
    Recency: parseInt(row.Recency) || null,
    MntWines: parseInt(row.MntWines) || 0,
    MntFruits: parseInt(row.MntFruits) || 0,
    MntMeatProducts: parseInt(row.MntMeatProducts) || 0,
    MntFishProducts: parseInt(row.MntFishProducts) || 0,
    MntSweetProducts: parseInt(row.MntSweetProducts) || 0,
    MntGoldProds: parseInt(row.MntGoldProds) || 0,
    NumDealsPurchases: parseInt(row.NumDealsPurchases) || 0,
    NumWebPurchases: parseInt(row.NumWebPurchases) || 0,
    NumCatalogPurchases: parseInt(row.NumCatalogPurchases) || 0,
    NumStorePurchases: parseInt(row.NumStorePurchases) || 0,
    NumWebVisitsMonth: parseInt(row.NumWebVisitsMonth) || 0,
    AcceptedCmp3: row.AcceptedCmp3 === '1',
    AcceptedCmp4: row.AcceptedCmp4 === '1',
    AcceptedCmp5: row.AcceptedCmp5 === '1',
    AcceptedCmp1: row.AcceptedCmp1 === '1',
    AcceptedCmp2: row.AcceptedCmp2 === '1',
    Complain: row.Complain === '1',
    Z_CostContact: parseInt(row.Z_CostContact) || 3,
    Z_Revenue: parseInt(row.Z_Revenue) || 11,
    Response: row.Response === '1'
  };
};

// Main function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding process...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Check if CSV file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      throw new Error(`CSV file not found at: ${CSV_FILE_PATH}`);
    }
    console.log(`📂 Found CSV file: ${CSV_FILE_PATH}`);
    
    // Read and parse CSV file
    const records = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv(CSV_OPTIONS))
        .on('data', (row) => {
          if (Object.keys(row).length > 0) {
            const transformedData = transformCsvData(row);
            if (transformedData && transformedData.ID) {
              records.push(transformedData);
            } else {
              console.log('Row missing valid ID:', row);
            }
          }
        })
        .on('end', () => {
          console.log(`📊 Parsed ${records.length} records from CSV file.`);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    
    if (records.length === 0) {
      console.log('❌ No records found in CSV file. Check the file content and CSV options.');
      return;
    }
    
    // Debug: Print first record to verify structure
    console.log('First record sample:', JSON.stringify(records[0], null, 2));
    
    // Bulk insert records into database
    const result = await MarketingData.bulkCreate(records, {
      // Skip duplicates based on primary key (ID)
      updateOnDuplicate: Object.keys(MarketingData.rawAttributes).filter(attr => attr !== 'ID'),
      validate: true
    });
    
    console.log(`✅ Successfully inserted ${result.length} records into the database.`);
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation errors:');
      error.errors.forEach((err) => {
        console.error(`- ${err.message}`);
      });
    }
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('👋 Database connection closed.');
  }
}

// Execute the seeding function
seedDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});

// Execute the seeding function
seedDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
