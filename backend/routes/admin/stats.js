
const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const { verifyToken, isAdmin } = require('../../middlewares/auth');

// Get admin dashboard statistics
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    // Get total number of users
    const [usersResult] = await db.pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const totalUsers = usersResult[0].totalUsers;
    
    // Get total number of products
    const [productsResult] = await db.pool.query('SELECT COUNT(*) as totalProducts FROM products');
    const totalProducts = productsResult[0].totalProducts;
    
    // Get total number of orders
    const [ordersResult] = await db.pool.query('SELECT COUNT(*) as totalOrders FROM orders');
    const totalOrders = ordersResult[0].totalOrders;
    
    // Get total revenue
    const [revenueResult] = await db.pool.query('SELECT SUM(total_price) as totalRevenue FROM orders WHERE is_paid = TRUE');
    const totalRevenue = revenueResult[0].totalRevenue || 0;
    
    // Return all statistics
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({ message: 'Failed to fetch admin statistics' });
  }
});

module.exports = router;
