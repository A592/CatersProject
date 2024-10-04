const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String }, 
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true } // Reference to the restaurant
});

module.exports = mongoose.model('Package', packageSchema);
