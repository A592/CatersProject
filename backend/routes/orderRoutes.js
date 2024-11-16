const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');


// Route to update the status of an order
router.post('/updateStatus/:orderId', orderController.updateOrderStatus);
// Route to get all orders for the logged-in user
router.get('/myOrders', orderController.getUserOrders);

router.get('/getBooking', orderController.getBooking);

//router.get('/payment',isAuthenticated,orderController.renderPaymentPage);

router.post('/storeBooking', orderController.storeBooking);

router.post('/confirmPayment', orderController.confirmPayment);

// Add this route in orderRoutes.js
router.post('/cancel/:orderId', orderController.cancelOrder);

module.exports = router;
