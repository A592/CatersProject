const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true }, // Cuisine field (e.g., Italian, Indian, Chinese, etc.)
    address: { type: String, required: true },
    contact: { type: String, required: true },
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],// Reference to menu items (optional)
    picture: { type: String, required: true } 
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
