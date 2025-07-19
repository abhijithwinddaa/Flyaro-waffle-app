const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  pickupCode: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  estimatedTime: { type: Number, default: 20 },
  specialInstructions: String,
  loyaltyPointsUsed: { type: Number, default: 0 },
  loyaltyPointsEarned: { type: Number, default: 0 },
  couponApplied: { type: String },
  discountAmount: { type: Number, default: 0 }
}, { timestamps: true });

orderSchema.pre('validate', function(next) {
  if (!this.pickupCode) {
    this.pickupCode = Math.floor(1000 + Math.random() * 9000).toString();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);