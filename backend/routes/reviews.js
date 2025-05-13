const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const [reviews] = await db.query(
      'SELECT r.*, u.name as userName FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
      [productId]
    );
    
    // Format the reviews to match the expected format in the frontend
    const formattedReviews = reviews.map(review => ({
      id: review.id.toString(),
      userId: review.user_id.toString(),
      userName: review.userName || 'Anonymous User',
      userImage: review.user_image || undefined,
      rating: review.rating,
      date: new Date(review.created_at).toISOString().split('T')[0],
      title: review.title,
      comment: review.content,
      helpful: review.helpful_count || 0,
      userHasMarkedHelpful: false
    }));
    
    res.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new review
router.post('/', async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    
    // Use a guest user ID for now (in a real app, this would be the logged-in user)
    const userId = 1;
    
    const [result] = await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, title, content, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, productId, rating, title, comment]
    );
    
    // Get the inserted review
    const [review] = await db.query(
      'SELECT * FROM reviews WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      id: review[0].id.toString(),
      userId: review[0].user_id.toString(),
      userName: 'Guest User', // In a real app, fetch the actual user name
      rating: review[0].rating,
      date: new Date(review[0].created_at).toISOString().split('T')[0],
      title: review[0].title,
      comment: review[0].content,
      helpful: 0
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark a review as helpful
router.post('/:reviewId/helpful', async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // Increment the helpful count for the review
    await db.query(
      'UPDATE reviews SET helpful_count = COALESCE(helpful_count, 0) + 1 WHERE id = ?',
      [reviewId]
    );
    
    res.json({ message: 'Review marked as helpful' });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report a review
router.post('/:reviewId/report', async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // Mark the review as reported
    await db.query(
      'UPDATE reviews SET reported = true WHERE id = ?',
      [reviewId]
    );
    
    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
