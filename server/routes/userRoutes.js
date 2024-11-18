// server/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(username,password)
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user, await bcrypt.compare(password, user.password));
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await User.findByIdAndUpdate(user._id, { isOnline: true });
   return  res.json({ token });
    
  } else {
    res.status(404).json({ error: 'Invalid credentials' });
  }
});

// Log out a user
router.post('/logout', async (req, res) => {
  const { userId } = req.body;
  await User.findByIdAndUpdate(userId, { isOnline: false });
  res.status(200).json({ message: "User logged out" });
});

// Endpoint to get online users excluding the current user
router.get('/online', async (req, res) => {
    try {
      const { userId } = req.query;
  
      // Fetch all users except the current user
      const onlineUsers = await User.find({ _id: { $ne: userId }, isOnline: true });
      
      res.json(onlineUsers);
    } catch (error) {
      console.error('Error fetching online users:', error);
      res.status(500).json({ error: 'Server error while fetching online users' });
    }
  });

module.exports = router;
