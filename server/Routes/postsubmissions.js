// routes/postSubmissions.js
const express = require('express');
const router = express.Router();
const PostSubmission = require('../models/postSubmission.model');
const ProblemSubmission = require('../models/problemSubmission.model');
const User = require('../models/user.model');

// Submit a post with all problem submissions
router.post('/submit', async (req, res) => {
  try {
    const { userId, classId, postId, problemSubmissions } = req.body;

    // Log the received request body
    console.log('Received request body:', req.body);

    // Verify problemSubmissions is an array
    if (!Array.isArray(problemSubmissions)) {
      return res.status(400).json({ message: 'problemSubmissions must be an array' });
    }

    // Verify user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all problem submissions by IDs
    const fetchedProblemSubmissions = await ProblemSubmission.find({
      _id: { $in: problemSubmissions },
      userId: userId
    });

    // Log the fetched problem submissions
    console.log('Fetched problem submissions:', fetchedProblemSubmissions);

    // Verify that all problem submissions belong to the user
    if (fetchedProblemSubmissions.length !== problemSubmissions.length) {
      return res.status(400).json({ message: 'Invalid problem submission IDs' });
    }

    const totalScore = fetchedProblemSubmissions.reduce((sum, ps) => sum + ps.score, 0);

    // Create a new post submission
    const postSubmission = new PostSubmission({
      userId,
      classId,
      postId,
      problemSubmissions: fetchedProblemSubmissions.map(ps => ps._id),
      totalScore,

    });

    await postSubmission.save();

    // Add the post submission reference to the user
    user.postSubmissions.push(postSubmission._id);
    await user.save();

    // Populate the problemSubmissions field before sending the response
    const populatedPostSubmission = await PostSubmission.findById(postSubmission._id).populate('problemSubmissions');

    res.status(201).json(populatedPostSubmission);
  } catch (error) {
    console.error('Error during post submission:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all post submissions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const postSubmissions = await PostSubmission.find({ userId }).populate('problemSubmissions');
    res.status(200).json(postSubmissions);
  } catch (error) {
    console.error('Error fetching user post submissions:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// New route to get all post submissions by postId
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const postSubmissions = await PostSubmission.find({ postId }).populate('problemSubmissions');
    res.status(200).json(postSubmissions);
  } catch (error) {
    console.error('Error fetching post submissions by postId:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Find the post submission by its ID
    const postSubmission = await PostSubmission.findById(submissionId).populate('problemSubmissions');

    if (!postSubmission) {
      return res.status(404).json({ message: 'Post submission not found' });
    }

    res.json(postSubmission);
  } catch (error) {
    console.error('Error fetching post submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get a post submission by its ID
router.get('/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Find the post submission by its ID
    const postSubmission = await PostSubmission.findById(submissionId).populate('problemSubmissions');

    if (!postSubmission) {
      return res.status(404).json({ message: 'Post submission not found' });
    }

    res.json(postSubmission);
  } catch (error) {
    console.error('Error fetching post submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
