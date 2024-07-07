const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { email, username, name, password, confirmPassword, batch, isTeacher } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
  
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = new User({
        email,
        username,
        name,
        password,
        batch: isTeacher ? undefined : batch,
        isTeacher,
        token: undefined // Ensure token is not set to null
      });
  
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };  

const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({ 
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { registerUser, loginUser };
