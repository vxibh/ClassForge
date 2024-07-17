const express = require('express');
const router = express.Router();
const PostSubmission = require('../models/postsubmission.model');
const User = require('../models/user.model');
const ProblemSubmission = require('../models/problemSubmission.model');
const { authMiddleware } = require('../middleware/authmiddleware');

// Create a new submission
router.post('/:classId/:postId', authMiddleware, async (req, res) => {
  const { classId, postId } = req.params;
  const { postDetails } = req.body; // Assuming only postDetails are needed for the submission

  try {
    // Check if the provided postDetails is valid
    const problemSubmission = await ProblemSubmission.findById(postDetails);
    if (!problemSubmission) {
      return res.status(400).json({ error: 'Invalid postDetails' });
    }

    // Create a new PostSubmission document
    const newSubmission = new PostSubmission({
      classId,
      postDetails,
      postId,
    });

    // Save the new submission
    await newSubmission.save();

    // Update user's postSubmissions array
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.postSubmissions.push(newSubmission._id);
    await user.save();

    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Failed to create submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Get a specific submission
router.get('/:classId/:postId', authMiddleware, async (req, res) => {
  const { classId, postId } = req.params;

  try {
    // Find the submission based on classId, postId, and user ID
    const submission = await PostSubmission.findOne({ classId, postId });
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Failed to fetch submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Get all submissions for a specific user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find the user and populate their postSubmissions
    const user = await User.findById(req.user.id).populate('postSubmissions');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.postSubmissions);
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;
