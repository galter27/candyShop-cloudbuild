const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Get
router.get('/', registerController.getRegisterPage);

// Post
router.post('/', registerController.postRegister);

module.exports = router;
