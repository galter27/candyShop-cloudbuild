const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); 

// Get
router.get('/', function(req, res) {
  res.render('login', { error: null });
});

// Post 
router.post('/', loginController.loginUser); 

module.exports = router;