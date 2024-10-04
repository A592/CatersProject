const Restaurant = require('../models/restaurantModel');
const packageModel = require('../models/packageModel');
// Function to get and display all restaurants
exports.getRestaurants = async (req, res) => {
    try {
        // Fetch all restaurants from the database
        const restaurants = await Restaurant.find();
        const user = req.session.user;
        // Render the EJS template and pass the restaurants data to it
        res.render('restaurants', { restaurants , user });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Error fetching restaurants' });
    }
};

// Controller to display menu items for a specific restaurant
exports.getRestaurantMenu = async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(restaurantId);
        req.session.restaurantId = restaurant._id;
        // Find the menu items for this restaurant
        const packages = await packageModel.find({ restaurant: restaurantId });

        // Render the restaurant menu page
        res.render('menu', { restaurant, packages });
    } catch (error) {
        res.status(500).send('Error fetching menu items');
    }
};
