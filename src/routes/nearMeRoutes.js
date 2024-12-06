const express = require('express');
const router = express.Router();
const nearMeController = require('../controllers/nearMeController');
const { isAuthenticated } = require('../controllers/loginController.js');

// Get
router.get('/', isAuthenticated, nearMeController.showNearestStore);
router.get('/getStores', nearMeController.getStores);

module.exports = router;