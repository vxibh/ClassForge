// Routes/classes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Class = require('../models/class.model');
const { authMiddleware } = require('../middleware/authmiddleware');

// Get posts that are due
router.get('/due', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledClasses',
      populate: {
        path: 'posts',
        match: {
          dueDate: { $gte: new Date() } // Ensure dueDate is in ISO format in the database
        }
      }
    });

    const duePosts = [];

    user.enrolledClasses.forEach((enrolledClass) => {
      enrolledClass.posts.forEach((post) => {
        // Convert dueDate string to Date object for comparison
        const dueDate = new Date(post.dueDate);

        // Compare dueDate with current date
        if (dueDate >= new Date()) {
          duePosts.push({
            classTitle: enrolledClass.title,
            classId: enrolledClass._id,
            postId: post._id,
            title: post.title,
            description: post.description,
            dueDate: dueDate.toISOString().split('T')[0] // Convert back to ISO date format for response if needed
          });
        }
      });
    });

    res.json(duePosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
