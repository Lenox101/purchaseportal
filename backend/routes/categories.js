
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new category (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required' });
  }
  
  try {
    // Check if category already exists
    const [existingCategory] = await db.query('SELECT * FROM categories WHERE name = ?', [name.trim()]);
    
    if (existingCategory.length > 0) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Insert new category
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name.trim()]);
    
    res.status(201).json({
      id: result.insertId,
      name: name.trim()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
