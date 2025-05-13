
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Create a new order
router.post('/', verifyToken, async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;
  
  try {
    // Start a transaction
    await db.query('START TRANSACTION');
    
    // Create order
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, shipping_address, payment_method, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, JSON.stringify(shippingAddress), paymentMethod, totalPrice, 'pending']
    );
    
    const orderId = orderResult.insertId;
    
    // Add order items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
      
      // Update product stock
      await db.query(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }
    
    // Commit transaction
    await db.query('COMMIT');
    
    // Get the complete order with items
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [orderItems] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    
    res.status(201).json({
      ...orders[0],
      items: orderItems
    });
  } catch (error) {
    // Rollback transaction on error
    await db.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/myorders', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    
    // Get items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await db.query('SELECT oi.*, p.name, p.image FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [order.id]);
      return {
        ...order,
        items
      };
    }));
    
    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Check if the order belongs to the user or if the user is an admin
    if (order.user_id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    // Get order items
    const [items] = await db.query('SELECT oi.*, p.name, p.image FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [order.id]);
    
    res.json({
      ...order,
      items
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order to paid
router.put('/:id/pay', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await db.query(
      'UPDATE orders SET status = ?, payment_result = ?, is_paid = TRUE, paid_at = NOW() WHERE id = ?',
      ['paid', JSON.stringify(req.body.paymentResult), req.params.id]
    );
    
    const [updatedOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json(updatedOrder[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order to delivered (admin only)
router.put('/:id/deliver', verifyToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await db.query(
      'UPDATE orders SET status = ?, is_delivered = TRUE, delivered_at = NOW() WHERE id = ?',
      ['delivered', req.params.id]
    );
    
    const [updatedOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json(updatedOrder[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
