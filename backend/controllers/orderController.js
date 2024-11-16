const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
// controllers/paymentController.js


  
// Controller method to handle booking submission
exports.confirmPayment = async (req, res) => {
    const { cardName, cardNumber, expDate, cvv } = req.body; // Payment details
    const user = req.session.user;
    const booking = req.session.booking;

    // Validate user and booking
    if (!user) {
        return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    if (!booking) {
        return res.status(400).json({ success: false, message: 'No booking data found.' });
    }

    // Here, integrate with a payment gateway like Stripe or PayPal.
    // For simplicity, we'll assume the payment is successful.

    try {
        // Create and save the order
        const newOrder = new Order({
            packageType: booking.packageType,
            numPeople: booking.numPeople,
            totalPrice: booking.totalPrice,
            user: user._id,
            restaurant: booking.restaurantId,
            dateTime: booking.dateTime,
            // Add additional fields if necessary
        });

        await newOrder.save();

       
        // Clear booking data from session
        req.session.booking = null;

        res.json({
            success: true,
            message: 'Payment successful. Booking confirmed!',
            redirectUrl: '/home', // Frontend route
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ success: false, message: 'Server error while confirming payment.' });
    }
};

  exports.storeBooking = async (req, res) => {
    const { packageType, numPeople, totalPrice, restaurantId, dateTime } = req.body;

    // Validate input
    if (!packageType || !numPeople || !totalPrice || !restaurantId || !dateTime) {
        return res.status(400).json({ success: false, message: 'All booking fields are required.' });
    }

    try {
        // Verify restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found.' });
        }

        // Verify user is logged in
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }

        // Store booking data in session
        req.session.booking = {
            packageType,
            numPeople,
            totalPrice,
            restaurantId,
            dateTime,
        };

        res.json({ success: true, message: 'Booking data stored successfully.' });
    } catch (error) {
        console.error('Error storing booking:', error);
        res.status(500).json({ success: false, message: 'Server error while storing booking.' });
    }
};

exports.getBooking = (req, res) => {
    const booking = req.session.booking;
    if (!booking) {
        return res.status(400).json({ success: false, message: 'No booking data found.' });
    }
    res.json({ success: true, booking });
};



exports.confirmPayment = async (req, res) => {
    const { packageType, numPeople, totalPrice, restaurantId, dateTime } = req.body;
    const user = req.session.user;
    const date = req.session.booking;

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not authenticated', redirectUrl: '/auth/sign-in' });
    }

    try {
        const newOrder = new Order({
            packageType,
            numPeople,
            totalPrice,
            user: user._id,
            restaurant: restaurantId,
            dateTime: dateTime
        });


        await newOrder.save();

        // Clear the session booking data after saving
        req.session.booking = null;

        res.json({
            success: true,
            message: 'Payment successful. Booking confirmed!',
            redirectUrl: '/home'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to confirm payment' });
    }
};

  exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate the status
        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        // Find the order and update the status
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
};
// Controller method to fetch user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }

        const orders = await Order.find({ user: user._id }).populate('restaurant').populate('user', 'name email');

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching orders.' });
    }
};

// Add this function to orderController.js
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Check if the order is within the 24-hour cancellation period
        const eventTime = new Date(order.dateTime);
        const now = new Date();
        const timeDifference = eventTime.getTime() - now.getTime();

        if (timeDifference < 24 * 60 * 60 * 1000) {
            return res.status(400).json({ success: false, message: 'Cancellation is allowed only 24 hours before the event.' });
        }

        // Update order status to "Canceled"
        order.status = 'Canceled';
        await order.save();

        res.json({ success: true, message: 'Order canceled successfully.' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ success: false, message: 'Server error while canceling order.' });
    }
};
