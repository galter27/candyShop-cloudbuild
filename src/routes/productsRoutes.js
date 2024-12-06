const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');
const currencyController = require('../controllers/currencyController.js');
const { isAuthenticated } = require('../controllers/loginController.js');

// Get 
router.get('/', isAuthenticated, productsController.getAllProducts);

// Get for statistics
router.get('/kosherData', productsController.getKosherData);
router.get('/adminData', productsController.getAdminData);

router.get('/:productId',isAuthenticated, productsController.getProductDetail);

// Get delete product form
router.get('/delete', productsController.showDeleteProductForm);

// Post 
router.post('/delete', productsController.deleteProduct);
router.post('/addFav', productsController.addNewFavorite);
router.post('/setCurrency', currencyController.setCurrency);

module.exports = router;