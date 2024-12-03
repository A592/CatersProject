const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');




router.post('/sign-up', authController.registerUser);


router.get('/logout', authController.logoutUser);



router.post('/sign-in', authController.loginUser);



module.exports = router;