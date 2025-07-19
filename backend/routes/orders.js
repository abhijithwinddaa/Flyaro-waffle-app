const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, specialInstructions, loyaltyPointsUsed } = req.body;
    
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      specialInstructions,
      loyaltyPointsUsed: loyaltyPointsUsed || 0,
      loyaltyPointsEarned: Math.floor(totalAmount / 10)
    });

    await order.save();
    await order.populate('items.menuItem user');

    // Update user loyalty points
    const user = await User.findById(req.user._id);
    user.loyaltyPoints = user.loyaltyPoints - (loyaltyPointsUsed || 0) + order.loyaltyPointsEarned;
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify-code', adminAuth, async (req, res) => {
  try {
    const { pickupCode } = req.body;
    const order = await Order.findOne({ pickupCode })
      .populate('user', 'name phone')
      .populate('items.menuItem');
    
    if (!order) return res.status(404).json({ message: 'Invalid pickup code' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).populate('items.menuItem user');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;