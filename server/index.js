const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('./models/user.model'); // Assuming you have a user model
const authRoutes = require('./Routes/auth');
const problemSubmissionRoutes = require('./Routes/problemSubmission');
const classesRouter = require('./Routes/classes');
const postsRouter = require('./Routes/posts');
const materialsRouter = require('./Routes/materials');
const postSubmissionsRouter = require('./Routes/postsubmissions');
const todoRouter = require('./Routes/duepost');
const userRouter = require('./Routes/users');
const evaluateRouter = require('./Routes/evaluate');
const announcementRouter = require('./Routes/announcements');
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const DB = process.env.MONGO_URL || "mongodb+srv://jatin321gupta:a2WBTz8qRHJcKPeQ@cluster0.win3l5k.mongodb.net/ClassForge?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err.message);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you have a JWT secret in your .env
    req.user = decoded;

    // Optionally, fetch the user details from the database if needed
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    req.user = user; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problemSubmission', problemSubmissionRoutes);
app.use('/api/classes', classesRouter);
app.use('/api/classes', postsRouter);
app.use('/api/classes', materialsRouter);
app.use('/api/postSubmissions', postSubmissionsRouter);
app.use('/api/to-do', todoRouter);
app.use('/api/users', userRouter);
app.use('/api/evaluate', evaluateRouter);
app.use('/api/announcements', announcementRouter);


// Example protected route
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user, logins: [] }); // Replace with actual logins if needed
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
