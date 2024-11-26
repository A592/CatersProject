// models/Equipment.js

const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Furniture', 'Utensils', 'Decorations', 'Electronics', 'Other'],
      default: 'Other',
    },
    stock: {
      type: Number,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', EquipmentSchema);
