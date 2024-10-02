const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');

// Controller method to handle booking submission
exports.submitBooking = async (req, res) => {
    try {
        const { packageType, numPeople, totalPrice, userId, restaurantId } = req.body;

        // Validate user and restaurant existence
        //const user = await User.findById(userId);
        const restaurant = await Restaurant.findById(restaurantId);

       // if (!user || !restaurant) {
         //   return res.status(404).json({ success: false, message: 'User or Restaurant not found' });
       // }

        // Create a new order and save to the database
        const newOrder = new Order({
            packageType,
            numPeople,
            totalPrice,
            user: '66f7087039bd5d504b4b3721',
            restaurant: restaurant
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