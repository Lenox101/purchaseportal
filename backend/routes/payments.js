
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middlewares/auth');
const db = require('../config/db');

// Create payment intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  const { amount } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.user.id.toString()
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle webhook events from Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle specific events
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Update order status in database
    try {
      const [orders] = await db.query(
        'SELECT * FROM orders WHERE payment_intent_id = ?',
        [paymentIntent.id]
      );
      
      if (orders.length > 0) {
        await db.query(
          'UPDATE orders SET status = ?, is_paid = TRUE, paid_at = NOW() WHERE payment_intent_id = ?',
          ['paid', paymentIntent.id]
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }
  
  res.json({ received: true });
});

module.exports = router;
