const express = require('express');
const Coupon = require('../models/Coupon');
const { adminAuth, auth } = require('../middleware/auth');

const router = express.Router();

// Create new coupon (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { code, discountPercent, expiresAt } = req.body;
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercent,
      expiresAt: new Date(expiresAt),
      createdBy: req.user._id
    });
    
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all coupons (admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete coupon (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle coupon active status (admin only)
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify coupon (for users)
router.post('/verify', auth, async (req, res) => {
  try {
    const { code } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }
    
    res.json({ 
      valid: true,
      discountPercent: coupon.discountPercent,
      code: coupon.code
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;