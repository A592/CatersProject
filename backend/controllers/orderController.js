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
            return res.status(401).json({ success: false, message: 'User not logged in',redirectUrl: '/sign-in' });
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