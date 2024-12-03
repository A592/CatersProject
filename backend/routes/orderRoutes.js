const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');




router.post('/updateStatus/:orderId', orderController.updateOrderStatus);

router.get('/myOrders', orderController.getUserOrders);

router.get('/getBooking', orderController.getBooking);

router.post('/storeBooking', orderController.storeBooking);

router.post('/confirmPayment', orderController.confirmPayment);


router.post('/cancel/:orderId', orderController.cancelOrder);



router.post('/create-checkout-session', orderController.createCheckoutSession);



module.exports = router;
