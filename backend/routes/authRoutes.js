const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
// Route for rendering the sign-up page
router.get('/sign-up', (req, res) => {
    res.render('sign-up', { message: null, messageType: null }); // No message on initial load
});

// Route for handling user registration (POST /register already exists)
router.post('/sign-up', authController.registerUser);

// Handle logout
router.get('/logout', authController.logoutUser);


// Render the login page
router.get('/sign-in', (req, res) => {
    res.render('sign-in', { message: null, messageType: null });
});

// Handle login form submission
router.post('/sign-in', authController.loginUser);

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { userId: req.session.userId, userRole: req.session.userRole });
});

module.exports = router;