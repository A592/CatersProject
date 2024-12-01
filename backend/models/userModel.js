const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { 
        type: String, 
        required: true, 
        match: [/^\d{10,15}$/, 'Please enter a valid phone number'], // Validates phone number format
    },
    role: { type: String, enum: ['user', 'restaurant_owner'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
