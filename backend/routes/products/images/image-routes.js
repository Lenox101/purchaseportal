
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../../../middlewares/auth');
const { 
  getProductMainImage, 
  getProductImageById, 
  deleteProductImage 
} = require('./image-controllers');

// Get product main image
router.get('/:id/image', getProductMainImage);

// Get specific product image by image id
router.get('/images/:imageId', getProductImageById);

// Delete a product image (admin only)
router.delete('/images/:imageId', verifyToken, isAdmin, deleteProductImage);

module.exports = router;
