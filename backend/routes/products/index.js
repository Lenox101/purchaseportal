
const express = require('express');
const router = express.Router();

// Import route handlers
const productGetRoutes = require('./product-get');
const productCreateRoutes = require('./product-create');
const productUpdateRoutes = require('./product-update');
const productDeleteRoutes = require('./product-delete');
const productImageRoutes = require('./images/image-routes');

// Register all routes
router.use('/', productGetRoutes);
router.use('/', productCreateRoutes);
router.use('/', productUpdateRoutes);
router.use('/', productDeleteRoutes);
router.use('/', productImageRoutes);

module.exports = router;
