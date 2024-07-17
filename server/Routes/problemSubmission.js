const express = require('express');
const router = express.Router();
const ProblemSubmission = require('../models/problemSubmission.model');
const User = require('../models/user.model');

// Submit a problem
router.post('/submit', async (req, res) => {
  try {
    const { userId, problemId, code, language } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const submission = new ProblemSubmission({
      userId,
      problemId,
      code,
      language,
      status: 'submitted'
    });

    await submission.save();

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

module.exports = router;
