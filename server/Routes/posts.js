const express = require('express');
const router = express.Router();
const Class = require('../models/class.model');

// Get all posts in a specific class
router.get('/:classId/posts', getClass, (req, res) => {
  res.json(res.class.posts);
});

// Get a specific post by ID
router.get('/:classId/posts/:postId', getClass, getPost, (req, res) => {
  res.json(res.post);
});

// Create a new post in a specific class
router.post('/:classId/posts', getClass, async (req, res) => {
  const post = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    date: req.body.date,
    dueDate: req.body.dueDate,
    materials: req.body.materials
  };

  res.class.posts.push(post);

  try {
    const updatedClass = await res.class.save();
    res.status(201).json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a specific post by ID
router.put('/:classId/posts/:postId', getClass, getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title;
  }
  if (req.body.description != null) {
    res.post.description = req.body.description;
  }
  if (req.body.content != null) {
    res.post.content = req.body.content;
  }
  if (req.body.date != null) {
    res.post.date = req.body.date;
  }
  if (req.body.dueDate != null) {
    res.post.dueDate = req.body.dueDate;
  }
  if (req.body.materials != null) {
    res.post.materials = req.body.materials;
  }

  try {
    await res.class.save();
    res.json(res.post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific post by ID
router.delete('/:classId/posts/:postId', getClass, getPost, async (req, res) => {
  try {
    res.post.remove();
    await res.class.save();
    res.json({ message: 'Deleted Post' });
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

// Middleware to get a post by ID
function getPost(req, res, next) {
  const post = res.class.posts.id(req.params.postId);
  if (post == null) {
    return res.status(404).json({ message: 'Cannot find post' });
  }
  res.post = post;
  next();
}

module.exports = router;
