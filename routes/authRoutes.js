// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send('Signup successful');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Signup failed');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Login failed');
  }
});

module.exports = router;
