const express = require('express');
const router = express.Router();
const PostSubmission = require('../models/postsubmission');

// Create a new submission
router.post('/:classId/:postId', async (req, res) => {
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
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Get all submissions for a specific post
router.get('/:classId/:postId', async (req, res) => {
  const { classId, postId } = req.params;

  try {
    const submissions = await PostSubmission.find({ classId, postId });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;
