// Routes/classes.js

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Class = require('../models/class.model');
const User = require('../models/user.model'); // Import the User model
const { authMiddleware } = require('../middleware/authmiddleware'); // Import auth middleware

// Function to generate a unique code
const generateCode = () => {
  return crypto.randomBytes(4).toString('hex'); // Generates an 8-character hex string
};

// Get all classes the user is enrolled in
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledClasses');
    res.json(user.enrolledClasses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific class by ID
router.get('/:classId', authMiddleware, getClass, (req, res) => {
  res.json(res.class);
});

// Create a new class
router.post('/create', authMiddleware, async (req, res) => {
  const classData = new Class({
    title: req.body.title,
    description: req.body.description,
    posts: [],
    code: generateCode() // Generate a unique code
  });

  try {
    const newClass = await classData.save();

    // Enroll the user in the created class
    const user = await User.findById(req.user.id);
    user.enrolledClasses.push(newClass._id);
    await user.save();

    res.status(201).json({ message: 'Class created successfully', classId: newClass._id, code: newClass.code });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Join a class by code
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const classData = await Class.findOne({ code: req.body.code });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if the user is already enrolled in the class
    if (!user.enrolledClasses.includes(classData._id)) {
      user.enrolledClasses.push(classData._id);
      await user.save();
    }

    res.status(200).json({ message: 'Joined class successfully', classId: classData._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a class by ID
async function getClass(req, res, next) {
  let classData;
  try {
    classData = await Class.findById(req.params.classId);
    if (classData == null) {
      return res.status(404).json({ message: 'Cannot find class' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.class = classData;
  next();
}

module.exports = router;
