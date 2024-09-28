const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },        // Name of the menu item (e.g., "Margherita Pizza")
    price: { type: Number, required: true },       // Price of the menu item
    description: { type: String, required: true }, // Description of the menu item
    image: { type: String, required: true },       // Image URL or path of the menu item
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }, // Reference to the restaurant
    createdAt: { type: Date, default: Date.now }   // Date when the menu item was created
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
