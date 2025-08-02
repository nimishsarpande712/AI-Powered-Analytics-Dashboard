const express = require('express');
const router = express.Router();
const DataController = require('../controllers/dataController');

// GET basic marketing data (first 10 records)
router.get('/', DataController.getMarketingData);

module.exports = router;
