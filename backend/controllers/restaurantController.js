const Restaurant = require('../models/restaurantModel');

// Render home page with a list of restaurants
exports.getHomePage = async (req, res) => {
    try {
        const restaurants = await Restaurant.find(); // Fetch all restaurants
        res.render('home', { restaurants }); // Render home.ejs with the restaurants data
    } catch (error) {
       res.render('home')// res.status(500).send('Error loading restaurants');
    }
};

// Render individual restaurant page
exports.getRestaurantPage = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.render('restaurant', { restaurant });
    } catch (error) {
        res.status(404).send('Restaurant not found');
    }
};
