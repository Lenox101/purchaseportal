
const express = require('express');
const router = express.Router();

// Import admin route handlers
const statsRoutes = require('./stats');

// Register all admin routes
router.use('/stats', statsRoutes);

module.exports = router;
