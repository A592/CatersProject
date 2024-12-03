const Restaurant = require('../models/restaurantModel');
const packageModel = require('../models/packageModel');




exports.getRestaurants = async (req, res) => {
    try {
        let query = {};

        if (req.query.cuisine && req.query.cuisine !== "") {
            query.cuisine = req.query.cuisine;
        }

        const restaurants = await Restaurant.find(query);

        res.json({ restaurants });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Error fetching restaurants' });
    }
};




exports.getRestaurantMenu = async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        const packages = await packageModel.find({ restaurant: restaurantId });

        res.json({ restaurant, packages });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu items' });
    }
};

