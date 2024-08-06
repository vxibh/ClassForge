const express = require('express');
const router = express.Router();
const multer = require('multer');
const Class = require('../models/class.model');
const path = require('path');
const fs = require('fs');
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Upload destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname; // Unique filename
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

router.get('/files/:classId/:postId/:fileName', async (req, res) => {
  try {
    const classId = req.params.classId;
    const postId = req.params.postId;
    const fileName = req.params.fileName;

    // Fetch the class from the database (to get file path)
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find the post in the class data
    const post = classData.posts.id(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get the file path from the materials array (assuming single file upload per post)
    const filePath = post.materials[0].filePath;
    console.log(filePath)
    // Construct the absolute path to the file
    const absolutePath = path.resolve(filePath);
    console.log(absolutePath)
    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Stream the file to the client
    res.sendFile(absolutePath);
  } catch (err) {
    console.error('Error retrieving file:', err);
    res.status(500).json({ message: 'Failed to retrieve file' });
  }
});


// Create a new post in a specific class with file upload
router.post('/:classId/posts', upload.single('file'), getClass, async (req, res) => {
  try {
    const materials = req.body.materials ? JSON.parse(req.body.materials) : [];

    if (req.file) {
      materials.push({
        title: req.file.originalname,
        type: req.file.mimetype,
        filePath: req.file.path,
      });
    }

    const post = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      date: req.body.date,
      dueDate: req.body.dueDate,
      materials: materials,
    };

    res.class.posts.push(post);
    const updatedClass = await res.class.save();
    res.status(201).json(updatedClass);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ message: err.message });
  }
});


// Middleware to get a post by postId
async function getPostById(req, res, next) {
  const postId = req.params.postId;
  try {
    // Find the class that contains the post with the given postId
    const classWithPost = await Class.findOne({ 'posts._id': postId });

    if (!classWithPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the post within the class
    const post = classWithPost.posts.id(postId);

    if (!post) {
      return res.status(404).json({ message: 'Cannot find post' });
    }

    res.post = post;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// GET route to fetch a post by its ID
router.get('/posts/:postId', getPostById, (req, res) => {
  res.json(res.post);
});

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
// Delete a specific post by ID
router.delete('/:classId/posts/:postId', async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId);
    if (!classData) {
      return res.status(404).json({ message: 'Cannot find class' });
    }

    const post = classData.posts.id(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Cannot find post' });
    }

    classData.posts.pull(req.params.postId);
    await classData.save();

    res.json({ message: 'Deleted Post' });
  } catch (err) {
    console.error('Error deleting post:', err);
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