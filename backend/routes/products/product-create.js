
const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const { verifyToken, isAdmin } = require('../../middlewares/auth');
const { saveBase64Image } = require('../../utils/image-utils');

// Create a new product (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, description, price, quantity, category_id, new_category, image, image_type, additionalImages } = req.body;
  
  try {
    const connection = await db.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Process image data
      let mainImagePath = null;
      let imageType = image_type;
      
      // If image is provided as base64 data, save it
      if (image && image.startsWith('data:image')) {
        mainImagePath = saveBase64Image(image, image_type, req.imagesDir);
        console.log(`Saved main image to: ${mainImagePath}`);
      }
      
      // Handle category - check if we need to create a new one
      let finalCategoryId = category_id;
      
      if (!category_id && new_category && new_category.trim() !== '') {
        // Check if category already exists
        const [existingCategory] = await connection.query(
          'SELECT id FROM categories WHERE name = ?', 
          [new_category.trim()]
        );
        
        if (existingCategory.length > 0) {
          finalCategoryId = existingCategory[0].id;
        } else {
          // Create new category
          const [newCategoryResult] = await connection.query(
            'INSERT INTO categories (name) VALUES (?)',
            [new_category.trim()]
          );
          finalCategoryId = newCategoryResult.insertId;
        }
      }
      
      // Insert the product
      const [result] = await connection.query(
        'INSERT INTO products (name, description, price, image_path, image_type, quantity, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, price, mainImagePath, imageType, quantity, finalCategoryId]
      );
      
      const productId = result.insertId;
      
      // Process additional images if provided as base64 data
      if (additionalImages && additionalImages.length > 0) {
        // Limit to maximum 4 additional images
        const imagesToProcess = additionalImages.slice(0, 4);
        
        for (const imgData of imagesToProcess) {
          if (imgData && imgData.startsWith('data:image')) {
            // Extract the MIME type from the data URL
            const imgType = imgData.split(';')[0].split(':')[1];
            
            // Save the image to disk
            const imgPath = saveBase64Image(imgData, imgType, req.imagesDir);
            
            // Insert into database
            await connection.query(
              'INSERT INTO product_images (product_id, image_path, image_type, is_primary) VALUES (?, ?, ?, ?)',
              [productId, imgPath, imgType, 0] // None of additional images is primary by default
            );
          }
        }
      }
      
      await connection.commit();
      
      // Get the new product with category info
      const [newProduct] = await connection.query(`
        SELECT p.id, p.name, p.description, p.price, p.quantity, p.created_at, p.updated_at,
               c.id as category_id, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `, [productId]);
      
      const productWithCategory = {
        ...newProduct[0],
        category: newProduct[0].category_name || 'Uncategorized'
      };
      
      res.status(201).json(productWithCategory);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
