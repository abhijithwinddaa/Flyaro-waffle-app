const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true
  },
  discountPercent: { 
    type: Number, 
    required: true,
    min: 1,
    max: 100
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  expiresAt: { 
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);