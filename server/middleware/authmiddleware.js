// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Import the User model

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' }); // Return error if no token is provided
  }

  try {
    const decoded = jwt.verify(token, 'secret'); // Verify the token using the secret key
    req.user = decoded; // Attach decoded token data to the request object

    // Optionally, fetch the user details from the database if needed
    const user = await User.findById(req.user.id).select('-password'); // Fetch user details from the database, excluding the password field
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' }); // Return error if user is not found
    }

    req.user = user; // Attach user info to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' }); // Return error if token verification fails
  }
};

module.exports = { authMiddleware }; // Export the middleware function
