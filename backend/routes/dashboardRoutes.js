const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurantModel');
const Order = require('../models/orderModel');

// Middleware to check if the user is a restaurant owner
function isRestaurantOwner(req, res, next) {
    if (req.session.user && req.session.user.role === 'restaurant_owner') {
        return next();
    } else {
        return res.redirect('/home');
    }
}
router.post('/dashboard/toggle-availability/:restaurantId', async (req, res) => {
    try {
        // Find the restaurant by its ID
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        // Toggle the availability status
        restaurant.availability = !restaurant.availability;
        await restaurant.save(); // Save the changes

        // Respond with the new availability status
        res.json({ success: true, newStatus: restaurant.availability });
    } catch (error) {
        console.error('Error toggling availability:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// Route to serve the dashboard for restaurant owners
router.get('/dashboard', isRestaurantOwner, async (req, res) => {
    try {
        // Fetch all restaurants owned by the logged-in user
        const restaurants = await Restaurant.find({ owner: req.session.user._id });

        // If the owner has no restaurants, render a message
        if (!restaurants || restaurants.length === 0) {
            return res.render('dashboard', { restaurants: [], orders: [], user: req.session.user });
        }

        // Fetch orders for all restaurants owned by the logged-in user
        const restaurantIds = restaurants.map(restaurant => restaurant._id);
        const orders = await Order.find({ restaurant: { $in: restaurantIds } }).populate('user').populate('restaurant');

        // Render the dashboard with restaurants and orders
        res.render('dashboard', {
            restaurants,
            orders,
            user: req.session.user // Pass user data to the template
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Server Error');
    }
});
router.get('/home', (req, res) => {
    // Check if the user is in the session
    const user = req.session.user;

    // Render the home page and pass the user to the EJS template
    res.render('home', { user });
});
module.exports = router;
