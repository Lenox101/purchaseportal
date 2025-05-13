
# E-commerce Backend API

This is a Node.js and MySQL backend for an e-commerce application. It provides API endpoints for managing products, users, orders, and payments.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` and update with your settings
5. Set up the database:
   ```
   mysql -u root -p < db/schema.sql
   ```
6. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)
- `GET /api/orders` - Get all orders (admin only)

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/webhook` - Handle webhook events from Stripe

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer <your_token>
```

## Environment Variables

- `PORT` - Server port (default: 4000)
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL user
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `JWT_SECRET` - Secret key for JWT
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
