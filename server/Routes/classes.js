const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Class = require('../models/class.model'); // Ensure this path is correct

// Function to generate a unique code
const generateCode = () => {
  return crypto.randomBytes(4).toString('hex'); // Generates an 8-character hex string
};

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific class by ID
router.get('/:classId', getClass, (req, res) => {
  res.json(res.class);
});

// Create a new class
router.post('/create', async (req, res) => {
  const classData = new Class({
    title: req.body.title,
    description: req.body.description,
    posts: [],
    code: generateCode() // Generate a unique code
  });

  try {
    const newClass = await classData.save();
    res.status(201).json({ message: 'Class created successfully', classId: newClass._id, code: newClass.code });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Join a class by code
router.post('/join', async (req, res) => {
  try {
    const classData = await Class.findOne({ code: req.body.code });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Add user to class (this part depends on your User model and logic)
    // For now, just returning the class data

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
