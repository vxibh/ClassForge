const express = require('express');
const router = express.Router();
const Class = require('../models/class.model');

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
router.post('/', async (req, res) => {
  const classData = new Class({
    title: req.body.title,
    description: req.body.description,
    posts: []
  });

  try {
    const newClass = await classData.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a specific class by ID
router.put('/:classId', getClass, async (req, res) => {
  if (req.body.title != null) {
    res.class.title = req.body.title;
  }
  if (req.body.description != null) {
    res.class.description = req.body.description;
  }

  try {
    const updatedClass = await res.class.save();
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific class by ID
router.delete('/:classId', getClass, async (req, res) => {
  try {
    await res.class.remove();
    res.json({ message: 'Deleted Class' });
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
