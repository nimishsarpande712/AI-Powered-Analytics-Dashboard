const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const apiRoutes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Analytics Dashboard API',
    status: 'Server is running successfully'
  });
});

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    res.status(200).json({
      status: 'healthy',
      message: 'API is functioning properly',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: true,
        status: 'Database connection established'
      },
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      message: 'API is running but database connection failed',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: false,
        error: error.message
      },
      version: '1.0.0'
    });
  }
});

// Database connection test
const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized successfully.');
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error('Full error:', error);
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    await testDatabaseConnection();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Analytics Dashboard Backend Started`);
      console.log(`📡 API endpoints available at:`);
      console.log(`   - GET  http://localhost:${PORT}/`);
      console.log(`   - GET  http://localhost:${PORT}/api/health`);
      console.log(`   - GET  http://localhost:${PORT}/api`);
      console.log(`   - GET  http://localhost:${PORT}/api/campaigns`);
      console.log(`   - POST http://localhost:${PORT}/api/campaigns`);
      console.log(`   - PUT  http://localhost:${PORT}/api/campaigns/:id`);
      console.log(`   - DEL  http://localhost:${PORT}/api/campaigns/:id`);
      console.log(`   - GET  http://localhost:${PORT}/api/marketing-data`);
      console.log(`   - GET  http://localhost:${PORT}/api/data`);
      console.log(`   - GET  http://localhost:${PORT}/api/dashboard-analytics`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the application
startServer();

module.exports = app;
