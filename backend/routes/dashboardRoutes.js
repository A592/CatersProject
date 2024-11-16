const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurantModel');
const Order = require('../models/orderModel');

// Middleware to check if the user is authenticated and is a restaurant owner
function isRestaurantOwner(req, res, next) {
    if (req.session.user && req.session.user.role === 'restaurant_owner') {
        return next();
    } else {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

// Route to get dashboard data for a restaurant owner
router.get('/dashboard', isRestaurantOwner, async (req, res) => {
    try {
        // Fetch all restaurants owned by the logged-in user
        const restaurants = await Restaurant.find({ owner: req.session.user._id });

        if (!restaurants || restaurants.length === 0) {
            return res.json({ success: true, restaurants: [], orders: [], user: req.session.user });
        }

        // Fetch all orders for restaurants owned by the logged-in user
        const restaurantIds = restaurants.map(restaurant => restaurant._id);
        const orders = await Order.find({ restaurant: { $in: restaurantIds } }).populate('user').populate('restaurant');

        res.json({ success: true, user: req.session.user, restaurants, orders });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to toggle restaurant availability
router.post('/dashboard/toggle-availability/:restaurantId', isRestaurantOwner, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        // Toggle the availability status
        restaurant.availability = !restaurant.availability;
        await restaurant.save();

        res.json({ success: true, newStatus: restaurant.availability });
    } catch (error) {
        console.error('Error toggling availability:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to update order status
router.put('/orders/:orderId', isRestaurantOwner, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Find the order by its ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the status of the order
        order.status = status;
        await order.save();

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
