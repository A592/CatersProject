const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Route to display all restaurants
router.get('/restaurants', restaurantController.getRestaurants);

// Route to display menu items for a specific restaurant
router.get('/restaurants/:restaurantId/menu', restaurantController.getRestaurantMenu);

module.exports = router;
