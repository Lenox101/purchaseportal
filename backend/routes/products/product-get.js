
const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const fs = require('fs');
const { readImageFile } = require('../../utils/image-utils');

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await db.pool.query(`
      SELECT p.id, p.name, p.description, p.price, p.quantity, p.created_at, p.updated_at, 
             c.id as category_id, c.name as category_name,
             p.image_path
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    
    // Get additional images for products
    const [additionalImages] = await db.pool.query(`
      SELECT product_id, id, is_primary 
      FROM product_images
    `);
    
    // Map products with proper category information and images
    const productsWithCategory = products.map(product => {
      const productImages = additionalImages.filter(img => img.product_id === product.id)
        .map(img => ({
          id: img.id,
          isPrimary: img.is_primary === 1
        }));
      
      return {
        ...product,
        category: product.category_name || 'Uncategorized',
        additionalImageIds: productImages.length > 0 ? productImages : undefined
      };
    });
    
    res.json(productsWithCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [product] = await db.pool.query(`
      SELECT p.*, c.id as category_id, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get additional images for the product
    const [additionalImages] = await db.pool.query(
      'SELECT id, image_path, image_type, is_primary FROM product_images WHERE product_id = ?', 
      [req.params.id]
    );
    
    // Add image IDs and category info to the product
    const productWithImages = {
      ...product[0],
      category: product[0].category_name || 'Uncategorized',
      additionalImageIds: additionalImages.map(img => ({
        id: img.id,
        isPrimary: img.is_primary === 1,
        imageType: img.image_type
      }))
    };
    
    res.json(productWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
