const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });

        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Server error, please try again later', success: false });
    }
};
exports.profile = (req, res) => {
    if (req.session && req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("WEDEDe");
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password', success: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password', success: false });
        }

        req.session.user = user; // Optional: Consider moving to token-based session management
        console.log(user);
        return res.status(200).json({
            message: 'Login successful!',
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error. Please try again later.', success: false });
    }
};


exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out. Please try again.', success: false });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully', success: true });
    });
};