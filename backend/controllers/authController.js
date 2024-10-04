const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('sign-up', { message: 'Email already in use', messageType: 'error' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Store hashed password
            role
        });

        // Save the user in the database
        await newUser.save();

        // Send response
        return res.render('sign-up', { message: 'User registered successfully', messageType: 'success' });
    } catch (error) {
        res.render('sign-up', { message: 'Server error, please try again later', messageType: 'error' });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('sign-in', { message: 'Invalid email or password', messageType: 'error' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('sign-in', { message: 'Invalid email or password', messageType: 'error' });
        }

        // If login is successful
        req.session.user = user;
        req.session.userId = user._id;  // Store user ID in session
        req.session.userRole = user.role;  // Store user role in session
        if (user.role === 'restaurant_owner') {
            return res.redirect('/dashboard'); // Redirect to dashboard if user is a restaurant owner
        } else {
            return res.redirect('/home'); // Redirect to home page if the user is a regular user
        }
       // return res.render('sign-in', { message: 'Login successful!', messageType: 'success' });
    } catch (error) {
        res.render('sign-in', { message: 'Server error. Please try again later.', messageType: 'error' });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home'); // If there is an error, keep the user logged in
        }
        res.clearCookie('connect.sid');  // Clear the session cookie
        return res.redirect('/sign-in');  // Redirect to the sign-in page
    });
};