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
app.use(cors());
app.use(express.json());


// Use the routes
app.use('/api/classes', classesRouter);
app.use('/api/classes', postsRouter);  // 
app.use('/api/classes', materialsRouter); 

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

// Server setup
const server = app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
