const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  ingredients: [String],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  preparationTime: { type: Number, default: 15 },
  isPopular: { type: Boolean, default: false },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);