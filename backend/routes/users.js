const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    // Generate token with 1 hour expiration
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).getTime() // Adding expiration timestamp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate token with 1 hour expiration
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).getTime() // Adding expiration timestamp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, isAdmin FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Update user fields
    const updatedName = name || user.name;
    const updatedEmail = email || user.email;
    
    let updatedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }
    
    await db.query(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
      [updatedName, updatedEmail, updatedPassword, req.user.id]
    );
    
    res.json({
      id: user.id,
      name: updatedName,
      email: updatedEmail,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, isAdmin, created_at, updated_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific user (admin only)
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, isAdmin, created_at, updated_at FROM users WHERE id = ?', [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const userId = req.params.id;
  
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Prepare update data
    const updatedData = {};
    let updateQuery = 'UPDATE users SET ';
    const queryParams = [];
    
    if (name !== undefined) {
      updateQuery += 'name = ?, ';
      queryParams.push(name);
    }
    
    if (email !== undefined) {
      updateQuery += 'email = ?, ';
      queryParams.push(email);
    }
    
    if (password !== undefined && password !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery += 'password = ?, ';
      queryParams.push(hashedPassword);
    }
    
    if (isAdmin !== undefined) {
      updateQuery += 'isAdmin = ?, ';
      queryParams.push(isAdmin);
    }
    
    // Remove the trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE id = ?';
    queryParams.push(userId);
    
    // Only proceed if there's something to update
    if (queryParams.length > 1) {
      await db.query(updateQuery, queryParams);
      
      const [updatedUser] = await db.query('SELECT id, name, email, isAdmin FROM users WHERE id = ?', [userId]);
      res.json({
        ...updatedUser[0],
        message: 'User updated successfully'
      });
    } else {
      res.status(400).json({ message: 'No fields provided for update' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle admin status (admin only)
router.put('/:id/toggle-admin', verifyToken, isAdmin, async (req, res) => {
  const userId = req.params.id;
  
  try {
    const [users] = await db.query('SELECT isAdmin FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentIsAdmin = users[0].isAdmin;
    const newIsAdmin = !currentIsAdmin;
    
    await db.query('UPDATE users SET isAdmin = ? WHERE id = ?', [newIsAdmin, userId]);
    
    res.json({
      id: parseInt(userId),
      isAdmin: newIsAdmin,
      message: `Admin status ${newIsAdmin ? 'granted' : 'revoked'} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent self-deletion
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Check if user has orders before deleting (to prevent foreign key constraints)
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [req.params.id]);
    
    if (orders.length > 0) {
      return res.status(400).json({ message: 'Cannot delete user with existing orders' });
    }
    
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
