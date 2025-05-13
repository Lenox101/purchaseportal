
const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const fs = require('fs');
const path = require('path');
const { verifyToken, isAdmin } = require('../../middlewares/auth');
const { readImageFile } = require('../../utils/image-utils');

// Delete a product (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const connection = await db.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Get product information including image path
      const [product] = await connection.query('SELECT image_path FROM products WHERE id = ?', [req.params.id]);
      
      if (product.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Get all image paths before deleting from database
      const [productImages] = await connection.query('SELECT image_path FROM product_images WHERE product_id = ?', [req.params.id]);
      
      // Delete the product (this will cascade and delete related product_images due to foreign key constraint)
      await connection.query('DELETE FROM products WHERE id = ?', [req.params.id]);
      
      await connection.commit();
      
      // Delete the main product image file after database transaction is complete
      if (product[0].image_path) {
        try {
          // Normalize the file path to handle any system-specific format issues
          const mainImagePath = product[0].image_path.replace(/\\\\/g, '\\');
          console.log(`Attempting to delete main product image: ${mainImagePath}`);
          
          if (fs.existsSync(mainImagePath)) {
            fs.unlinkSync(mainImagePath);
            console.log(`Successfully deleted main product image: ${mainImagePath}`);
          } else {
            console.warn(`Main product image file not found: ${mainImagePath}`);
          }
        } catch (fileError) {
          console.warn('Could not delete main product image file:', fileError.message);
        }
      }
      
      // Delete all additional product image files
      let deletedCount = 0;
      for (const img of productImages) {
        if (img.image_path) {
          try {
            // Normalize the file path
            const imagePath = img.image_path.replace(/\\\\/g, '\\');
            console.log(`Attempting to delete additional product image: ${imagePath}`);
            
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              deletedCount++;
              console.log(`Successfully deleted additional product image: ${imagePath}`);
            } else {
              console.warn(`Additional product image file not found: ${imagePath}`);
            }
          } catch (fileError) {
            console.warn('Could not delete additional product image file:', fileError.message);
          }
        }
      }
      
      console.log(`Product deletion complete. Deleted ${deletedCount} additional images.`);
      res.json({ 
        message: 'Product deleted successfully',
        imagesDeleted: deletedCount + (product[0].image_path ? 1 : 0)
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
