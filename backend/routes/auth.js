const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;
const jwtExp = process.env.JWT_EXPIRES_IN || '7d';

// register
router.post('/register', [
  body('username').isString(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user','admin'])
], async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username, password, role } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User exists' });
    const user = new User({ username, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExp });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// login
router.post('/login', [
  body('username').isString(),
  body('password').isString()
], async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExp });
  res.json({ token, user: { id: user._id, username: user.username, role: user.role }});
});

module.exports = router;
