// routes/announcements.js

const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Class = require('../models/class.model');
const { authMiddleware } = require('../middleware/authmiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledClasses');

    // Extract posts from enrolled classes
    let announcements = [];
    user.enrolledClasses.forEach(classData => {
      classData.posts.forEach(post => {
        announcements.push({
          text: `New assignment posted: "${post.title}`,
          className: classData.title,
          time: post.date
        });
      });
    });

    // Sort by date descending and limit to top 5-6 announcements
    announcements.sort((a, b) => new Date(b.time) - new Date(a.time));
    announcements = announcements.slice(0, 6);

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;