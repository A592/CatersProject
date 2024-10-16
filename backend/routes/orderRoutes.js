const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');
// POST route to handle booking form submission
router.post('/submitBooking', orderController.submitBooking);
// Route to update the status of an order
router.post('/updateStatus/:orderId', orderController.updateOrderStatus);
// Route to get all orders for the logged-in user
router.get('/myOrders', isAuthenticated, orderController.getUserOrders);

module.exports = router;
