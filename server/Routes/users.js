const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Adjust the path if necessary
const { authMiddleware } = require('../middleware/authmiddleware'); // Adjust the path if necessary

// Route to fetch the currently logged-in user's data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Find the user by the ID set in req.user by the authMiddleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
