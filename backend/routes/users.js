const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/favorites/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const itemId = req.params.itemId;
    
    if (user.favoriteItems.includes(itemId)) {
      user.favoriteItems = user.favoriteItems.filter(id => id.toString() !== itemId);
    } else {
      user.favoriteItems.push(itemId);
    }
    
    await user.save();
    res.json({ favoriteItems: user.favoriteItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/loyalty-points', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loyaltyPoints');
    res.json({ loyaltyPoints: user.loyaltyPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;