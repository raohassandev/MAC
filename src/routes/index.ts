// routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const deviceRoutes = require('./deviceRoutes');
const profileRoutes = require('./profileRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/profiles', profileRoutes);

module.exports = router;
