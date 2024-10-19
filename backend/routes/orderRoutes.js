const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');


// Route to update the status of an order
router.post('/updateStatus/:orderId', orderController.updateOrderStatus);
// Route to get all orders for the logged-in user
router.get('/myOrders', isAuthenticated, orderController.getUserOrders);


router.get('/payment',isAuthenticated,orderController.renderPaymentPage);

router.post('/storeBooking', orderController.storeBooking);

router.post('/confirmPayment', orderController.confirmPayment);

module.exports = router;
