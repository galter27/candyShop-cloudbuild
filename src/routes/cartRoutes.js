const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../controllers/loginController.js');

// Get
router.get('/', isAuthenticated,cartController.showCart);

// Post
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart);
router.post('/checkout', cartController.checkout);
router.post('/update', cartController.updateCart);

module.exports = router;