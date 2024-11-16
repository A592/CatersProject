const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
//const { isAuthenticated } = require('../middleware/authMiddleware');


// Route for handling user registration (POST /register already exists)
router.post('/sign-up', authController.registerUser);

// Handle logout
router.get('/logout', authController.logoutUser);


//router.get('/profile', authMiddleware, authController.profile);

// Handle login form submission
router.post('/sign-in', authController.loginUser);



module.exports = router;