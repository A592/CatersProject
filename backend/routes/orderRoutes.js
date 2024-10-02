const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST route to handle booking form submission
router.post('/submitBooking', orderController.submitBooking);

module.exports = router;
