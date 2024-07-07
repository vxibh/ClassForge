const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/auth');

const app = express();
const path = require('path');
require("dotenv").config();
const classesRouter = require('./Routes/classes');
const postsRouter = require('./Routes/posts');
const materialsRouter = require('./Routes/materials');
const postSubmissionsRouter = require('./Routes/postsubmissions');
app.use(cors());
app.use(express.json());


// Use the routes
app.use('/api/classes', classesRouter);
app.use('/api/classes', postsRouter);  // 
app.use('/api/classes', materialsRouter); 
app.use('/api/postSubmissions', postSubmissionsRouter);

// MongoDB connection
const DB = process.env.MONGO_URL || "mongodb+srv://jatin321gupta:a2WBTz8qRHJcKPeQ@cluster0.win3l5k.mongodb.net/ClassForge?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err.message);
  });

  app.use('/api/auth', authRoutes);

  const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual JWT secret
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
  
  // Example protected route
  app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json({ user: req.user, logins: [] }); // Replace with actual logins if needed
  });
  


// Server setup
const server = app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
