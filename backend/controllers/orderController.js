const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
require('dotenv').config();
const nodemailer = require('nodemailer');
const { paymentConfirmationEmail } = require('../templates/emailTemplates');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    // e.g., 'gmail'
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  
// Controller method to handle booking submission


  exports.storeBooking = async (req, res) => {
    const { packageType, numPeople, totalPrice, restaurantId, dateTime, includeEquipment,district, streetName,} = req.body;

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

        
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }
        const equipmentCost = includeEquipment ? numPeople * 30 : 0;
        // Store booking data in session
        req.session.booking = {
            packageType,
            numPeople,
            totalPrice,
            restaurantId,
            dateTime,
            includeEquipment,
            equipmentCost,
            address: {
                district,
                streetName,
              },
        };
        console.log('Booking data stored:', req.session.booking);
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
/*
exports.createCheckoutSession = async (req, res) => {
    try {
      const booking = req.session.booking;
  
      if (!booking) {
        return res.status(400).json({ success: false, message: 'No booking data found in session.' });
      }
  
      const user = req.session.user;
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not authenticated.' });
      }
  
      // Create a Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'aed',
              product_data: {
                name: `Booking: ${booking.packageType}`,
                description: `Event at Restaurant ID: ${booking.restaurantId}`,
              },
              unit_amount: booking.totalPrice * 100, // Stripe accepts amounts in cents
            },
            quantity: 1,
          },
        ],
        customer_email: user.email,
        metadata: {
          userId: user._id.toString(),
          packageType: booking.packageType,
          numPeople: booking.numPeople.toString(),
          totalPrice: booking.totalPrice.toString(),
          equipmentCost: booking.equipmentCost.toString(),
          restaurantId: booking.restaurantId.toString(),
          dateTime: booking.dateTime,
          district: booking.address?.district || '', // Add district to metadata
          streetName: booking.address?.streetName || '',
          
        },
        success_url: `${process.env.CLIENT_URL}/Success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/failure`,
      });
  
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      res.status(500).json({ success: false, message: 'Failed to create Stripe session.' });
    }
  };
*/

exports.createCheckoutSession = async (req, res) => {
  try {
    const booking = req.session.booking;

    if (!booking) {
      return res.status(400).json({ success: false, message: 'No booking data found in session.' });
    }

    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    // Format the event date and time
    const eventDateTime = new Date(booking.dateTime).toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });

    // Create line items array
    const line_items = [];

    // Package cost per person
    line_items.push({
      price_data: {
        currency: 'sar',
        product_data: {
          name: `Package: ${booking.packageType}`,
          description: `Event on ${eventDateTime} at ${booking.address?.district || ''}, ${booking.address?.streetName || ''}`,
        },
        unit_amount: (booking.totalPrice - booking.equipmentCost) * 100, // Convert to cents
      },
      quantity: 1,
    });

    // Equipment cost, if applicable
    if (booking.includeEquipment && booking.equipmentCost > 0) {
      line_items.push({
        price_data: {
          currency: 'sar',
          product_data: {
            name: 'Equipment Rental',
            description: `Equipment for ${booking.numPeople} people`,
          },
          unit_amount: booking.equipmentCost * 100, // Convert to cents
        },
        quantity: 1,
      });
    }

    // Create the Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        packageType: booking.packageType,
        numPeople: booking.numPeople.toString(),
        totalPrice: booking.totalPrice.toString(),
        equipmentCost: booking.equipmentCost.toString(),
        restaurantId: booking.restaurantId.toString(),
        dateTime: booking.dateTime,
        district: booking.address?.district || '',
        streetName: booking.address?.streetName || '',
      },
      success_url: `${process.env.CLIENT_URL}/Success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/failure`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ success: false, message: 'Failed to create Stripe session.' });
  }
};


/*
exports.confirmPayment = async (req, res) => {
    const booking = req.session.booking;
    const user = req.session.user;
  
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }
  
    if (!booking) {
      return res.status(400).json({ success: false, message: 'No booking data found.' });
    }
  
    try {
      const { packageType, numPeople, totalPrice, restaurantId, dateTime, includeEquipment, equipmentCost } = booking;
  
      // Check if an order already exists to prevent duplicates
      const existingOrder = await Order.findOne({
        user: user._id,
        packageType,
        restaurant: restaurantId,
        dateTime,
      });
  
      if (existingOrder) {
        console.log('Order already exists:', existingOrder);
        return res.status(200).json({
          success: true,
          bookingDetails: existingOrder, // Return the existing order details
        });
      }
  
      // Create a new order
      const newOrder = new Order({
        packageType,
        numPeople,
        totalPrice,
        restaurant: restaurantId,
        dateTime,
        user: user._id,
        includeEquipment,
        equipmentCost,
      });
  
      await newOrder.save();
  
      console.log('Order saved successfully:', newOrder);
  
      const mailOptions = {
        from: `"Caters" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Payment Confirmation - Order #${newOrder._id}`,
        html: paymentConfirmationEmail(newOrder, user),
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      // Clear booking session data
      req.session.booking = null;
  
      res.json({
        success: true,
        bookingDetails: newOrder,
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ success: false, message: 'Failed to confirm payment.' });
    }
  };*/
  exports.confirmPayment = async (req, res) => {
    const { sessionId } = req.body;
  
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }
  
    try {
      // Fetch the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ success: false, message: 'Payment not completed.' });
      }
  
      // Check if an order already exists with this session ID
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
  
      if (existingOrder) {
        console.log('Order already exists:', existingOrder);
        return res.status(200).json({
          success: true,
          bookingDetails: existingOrder,
        });
      }
  
      // Retrieve booking data from session metadata
      const {
        userId,
        packageType,
        numPeople,
        totalPrice,
        equipmentCost,
        restaurantId,
        dateTime,
        district,
        streetName,
      } = session.metadata;
  
      // Create a new order
      const newOrder = new Order({
        packageType,
        numPeople,
        totalPrice,
        restaurant: restaurantId,
        dateTime,
        user: userId,
        includeEquipment: equipmentCost > 0,
        equipmentCost,
        stripeSessionId: sessionId,
        address: {
            district,
            streetName,
          },
      });
  
      await newOrder.save();
  
      console.log('Order saved successfully:', newOrder);
  
      const user = await User.findById(userId);
  
      const mailOptions = {
        from: `Caters <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Payment Confirmation - Order #${newOrder._id}`,
        html: paymentConfirmationEmail(newOrder, user),
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      res.json({
        success: true,
        bookingDetails: newOrder,
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ success: false, message: 'Failed to confirm payment.' });
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
