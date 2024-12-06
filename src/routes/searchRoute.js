const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController.js');
const { isAuthenticated } = require('../controllers/loginController.js');

// Get
router.get('/', isAuthenticated, searchController.searchProduct);
router.get('/sweetType/:sweetType', isAuthenticated, searchController.searchBySweetType);
router.get('/filter',isAuthenticated, searchController.searchByFilter);

module.exports = router;