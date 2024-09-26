const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Home page route
router.get('/', restaurantController.getHomePage);

// Individual restaurant page route
router.get('/restaurant/:id', restaurantController.getRestaurantPage);

module.exports = router;
