const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');

// Controller method to handle booking submission
exports.submitBooking = async (req, res) => {
    try {
        const { packageType, numPeople, totalPrice } = req.body;

        // Validate user and restaurant existence
        //const user = await User.findById(userId);
        const restaurantId = req.session.restaurantId;
        const restaurant = await Restaurant.findById(restaurantId);
        const user = req.session.user;
        if (!restaurant) {
            return res.status(401).json({ success: false, message: 'Restaurant not found in session',redirectUrl: '/restaurant' });
        }
        if(!restaurantId){
            return res.status(401).json({ success: false, message: 'Restaurant not found in session',redirectUrl: '/restaurant' });
        }
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not logged in',redirectUrl: '/auth/sign-in' });
        }

        // Create a new order and save to the database
        const newOrder = new Order({
            packageType,
            numPeople,
            totalPrice,
            user: user._id,
            restaurant: restaurant._id
        });

        await newOrder.save();

          // Log for debugging
          console.log('Order saved successfully:', newOrder);

          // Send the success response
          res.json({
              success: true,
              message: 'Booking confirmed!',
              redirectUrl: '/home'  // Redirect to the homepage
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Failed to process booking' });
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
        const userId = req.session.user._id;  // Assuming the user is stored in session
        const orders = await Order.find({ user: userId }).populate('restaurant');  // Populate restaurant info
        
        // Render the orders in an EJS template
        res.render('myOrders', { orders , user});
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
};

