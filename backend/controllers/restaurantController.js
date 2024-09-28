const Restaurant = require('../models/restaurantModel');
const MenuItem = require('../models/menuItemModel');
// Function to get and display all restaurants
exports.getRestaurants = async (req, res) => {
    try {
        // Fetch all restaurants from the database
        const restaurants = await Restaurant.find();
        
        // Render the EJS template and pass the restaurants data to it
        res.render('restaurants', { restaurants });
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

        // Find the menu items for this restaurant
        const menuItems = await MenuItem.find({ restaurant: restaurantId });

        // Render the restaurant menu page
        res.render('menu', { restaurant, menuItems });
    } catch (error) {
        res.status(500).send('Error fetching menu items');
    }
};
