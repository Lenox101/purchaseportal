
const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const { verifyToken, isAdmin } = require('../../middlewares/auth');
const { saveBase64Image } = require('../../utils/image-utils');

// Update a product (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, description, price, quantity, primaryImageId, category_id, new_category, image, image_type, additionalImages } = req.body;
  
  try {
    const connection = await db.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const [product] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
      
      if (product.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Process main image if provided as base64 data
      let mainImagePath = null;
      let imageType = image_type;
      let imageQuery = '';
      let queryParams = [];
      
      if (image && image.startsWith('data:image')) {
        mainImagePath = saveBase64Image(image, image_type, req.imagesDir);
        imageQuery = ', image_path = ?, image_type = ?';
        console.log(`Updated main image to: ${mainImagePath}`);
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
      
      // Build the query and parameters
      if (mainImagePath) {
        queryParams = [name, description, price, quantity, finalCategoryId, mainImagePath, imageType, req.params.id];
      } else {
        queryParams = [name, description, price, quantity, finalCategoryId, req.params.id];
      }
      
      // Update the product
      await connection.query(
        `UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category_id = ? ${imageQuery} WHERE id = ?`,
        queryParams
      );
      
      // If primaryImageId is provided, set the specified image as primary
      if (primaryImageId) {
        // First reset all primary flags
        await connection.query(
          'UPDATE product_images SET is_primary = 0 WHERE product_id = ?',
          [req.params.id]
        );
        
        // Set the selected image as primary
        await connection.query(
          'UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?',
          [primaryImageId, req.params.id]
        );
      }
      
      // Process additional images if provided as base64 data
      if (additionalImages && additionalImages.length > 0) {
        // Get current image count before adding new ones
        const [currentImages] = await connection.query(
          'SELECT COUNT(*) as count FROM product_images WHERE product_id = ?',
          [req.params.id]
        );
        
        const currentCount = currentImages[0].count;
        const mainImageExists = product[0].image_path ? 1 : 0;
        const totalCurrentImages = currentCount + mainImageExists;
        
        // Limit to maximum 5 images (including main image)
        const maxAdditionalToAdd = 5 - totalCurrentImages;
        
        if (maxAdditionalToAdd > 0) {
          const imagesToProcess = additionalImages.slice(0, maxAdditionalToAdd);
          
          for (const imgData of imagesToProcess) {
            if (imgData && imgData.startsWith('data:image')) {
              // Extract the MIME type from the data URL
              const imgType = imgData.split(';')[0].split(':')[1];
              
              // Save the image to disk
              const imgPath = saveBase64Image(imgData, imgType, req.imagesDir);
              
              // Insert into database
              await connection.query(
                'INSERT INTO product_images (product_id, image_path, image_type) VALUES (?, ?, ?)',
                [req.params.id, imgPath, imgType]
              );
            }
          }
        }
      }
      
      await connection.commit();
      
      // Get the updated product with category info
      const [updatedProduct] = await connection.query(`
        SELECT p.id, p.name, p.description, p.price, p.quantity, p.created_at, p.updated_at,
               c.id as category_id, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `, [req.params.id]);
      
      const productWithCategory = {
        ...updatedProduct[0],
        category: updatedProduct[0].category_name || 'Uncategorized'
      };
      
      res.json(productWithCategory);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
