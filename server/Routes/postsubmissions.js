// Routes/postsubmissions.js

const express = require('express');
const router = express.Router();
const PostSubmission = require('../models/postsubmission');
const User = require('../models/user.model'); // Import the User model
const { authMiddleware } = require('../middleware/authmiddleware'); // Import auth middleware

// Create a new submission
router.post('/:classId/:postId', authMiddleware, async (req, res) => {
  const { classId, postId } = req.params;
  const { problemId, code, language } = req.body;

  try {
    const newSubmission = new PostSubmission({
      classId,
      postId,
      problemId,
      code,
      language,
    });

    await newSubmission.save();

    const user = await User.findById(req.user.id);
    user.postSubmissions.push(newSubmission._id);
    await user.save();

    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Get all submissions for a specific user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('postSubmissions');
    res.status(200).json(user.postSubmissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;
