const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    packageType: {
        type: String,
        required: true
    },
    numPeople: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    address: {
        district: { type: String, required: true }, // Add district
        streetName: { type: String, required: true }, // Add street name
      },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed','Canceled'], 
        default: 'Pending'
    },
    includeEquipment: {
        type: Boolean,
        default: false, // Default to not including equipment
    },
    equipmentCost: {
        type: Number,
        default: 0, // Default equipment cost
    },
    stripeSessionId: { type: String, unique: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
