const express = require('express');
const router = express.Router();
const Class = require('../models/class.model');

// Get all materials in a specific post
router.get('/:classId/posts/:postId/materials', getClass, getPost, (req, res) => {
  res.json(res.post.materials);
});

// Get a specific material by ID
router.get('/:classId/posts/:postId/materials/:materialId', getClass, getPost, getMaterial, (req, res) => {
  res.json(res.material);
});

// Create a new material in a specific post
router.post('/:classId/posts/:postId/materials', getClass, getPost, async (req, res) => {
  const material = {
    type: req.body.type,
    link: req.body.link
  };

  res.post.materials.push(material);

  try {
    await res.class.save();
    res.status(201).json(res.post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a specific material by ID
router.put('/:classId/posts/:postId/materials/:materialId', getClass, getPost, getMaterial, async (req, res) => {
  if (req.body.type != null) {
    res.material.type = req.body.type;
  }
  if (req.body.link != null) {
    res.material.link = req.body.link;
  }

  try {
    await res.class.save();
    res.json(res.material);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific material by ID
router.delete('/:classId/posts/:postId/materials/:materialId', getClass, getPost, getMaterial, async (req, res) => {
  try {
    res.material.remove();
    await res.class.save();
    res.json({ message: 'Deleted Material' });
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

// Middleware to get a material by ID
function getMaterial(req, res, next) {
  const material = res.post.materials.id(req.params.materialId);
  if (material == null) {
    return res.status(404).json({ message: 'Cannot find material' });
  }
  res.material = material;
  next();
}

module.exports = router;
