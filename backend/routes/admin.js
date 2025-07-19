const express = require('express');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.put('/profile', adminAuth, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await User.findById(req.user._id);

    if (currentPassword && !(await admin.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (email && email !== admin.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: admin._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      admin.email = email;
    }

    if (name) admin.name = name;
    if (newPassword) admin.password = newPassword;

    await admin.save();
    res.json({ message: 'Profile updated successfully', user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;