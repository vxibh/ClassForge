const express = require('express');
const router = express.Router();
const ProblemSubmission = require('../models/problemSubmission.model');
const User = require('../models/user.model');

// Submit a problem
router.post('/submit', async (req, res) => {
  try {
    const { userId, problemId, code, language, postId } = req.body;

    // Check if userId exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new ProblemSubmission
    const submission = new ProblemSubmission({
      userId,
      problemId,
      code,
      language,
      status: 'submitted',
      postId: postId || null, // Set postId if provided, otherwise set to null
    });

    // Save ProblemSubmission
    await submission.save();

    // Update user's problemSubmissions array
    user.problemSubmissions.push(submission._id);
    await user.save();

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch submissions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await ProblemSubmission.find({ userId }).populate('problemId');
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:postId/:userId', async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const submissions = await ProblemSubmission.find({
      postId,
      userId,
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId/problem/:problemId/language/:language', async (req, res) => {
  try {
    const { userId, problemId, language } = req.params;
    const submission = await ProblemSubmission.findOne({ userId, problemId, language });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update submission status
router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await ProblemSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = status;
    await submission.save();

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

async function getProblemSubmissionById(req, res, next) {
  const problemSubmissionId = req.params.problemSubmissionId;
  try {
    const problemSubmission = await ProblemSubmission.findById(problemSubmissionId);
    if (!problemSubmission) {
      return res.status(404).json({ message: 'Problem submission not found' });
    }
    res.problemSubmission = problemSubmission;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// GET route to fetch a problem submission by its ID
router.get('/:problemSubmissionId', getProblemSubmissionById, (req, res) => {
  res.json(res.problemSubmission);
});

module.exports = router;
