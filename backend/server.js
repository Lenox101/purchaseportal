const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Load environment variables
dotenv.config();

// Define image upload directories
const IMAGES_DIR = path.join(__dirname, 'images');
const MYSQL_UPLOADS_DIR = process.env.MYSQL_UPLOADS_DIR || 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads';

// Ensure images directory exists with verbose logging
if (!fs.existsSync(IMAGES_DIR)) {
  console.log(`Creating images directory at ${IMAGES_DIR}`);
  try {
    fs.mkdirSync(IMAGES_DIR, { recursive: true, mode: 0o755 });
    console.log(`Successfully created images directory at ${IMAGES_DIR}`);
  } catch (error) {
    console.error(`Failed to create images directory: ${error.message}`);
    console.error(`Error details: ${error.stack}`);
  }
} else {
  console.log(`Images directory already exists at ${IMAGES_DIR}`);
}

// Ensure MySQL uploads directory exists
if (!fs.existsSync(MYSQL_UPLOADS_DIR)) {
  console.warn(`MySQL uploads directory (${MYSQL_UPLOADS_DIR}) does not exist! Please create it manually.`);
}

// Verify images directory is writable
try {
  fs.accessSync(IMAGES_DIR, fs.constants.W_OK);
  console.log(`Images directory is writable: ${IMAGES_DIR}`);
} catch (error) {
  console.error(`WARNING: Images directory is not writable: ${error.message}`);
  console.log(`Current process user: ${process.env.USERNAME || process.env.USER || 'unknown'}`);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store images in our dedicated images directory
    console.log(`Storing uploaded file in: ${IMAGES_DIR}`);
    cb(null, IMAGES_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext;
    console.log(`Generated filename for upload: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Increased to 25MB file size limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Import routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const categoryRoutes = require('./routes/categories');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin'); // Import admin routes

// Initialize express app
const app = express();

// Middleware
app.use(cors());
// Increase JSON payload limit to 100MB for base64 encoded images
app.use(express.json({ limit: '100mb' })); 
// Increase URL-encoded payload limit to 100MB
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Make upload middleware and directories available in routes
app.use((req, res, next) => {
  req.uploadSingle = upload.single('image');
  req.uploadMultiple = upload.array('images', 5); // Allow up to 5 images
  req.mysqlUploadsDir = MYSQL_UPLOADS_DIR;
  req.imagesDir = IMAGES_DIR;
  next();
});

// Serve static images from the images directory with detailed logging
app.use('/images', (req, res, next) => {
  console.log(`Image request received: ${req.url}`);
  next();
}, express.static(IMAGES_DIR, {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));

// Create a test image to verify the directory is working
const createTestImage = () => {
  const testImagePath = path.join(IMAGES_DIR, 'test-image.txt');
  try {
    fs.writeFileSync(testImagePath, 'This is a test file to verify the images directory is working properly.');
    console.log(`Test file created successfully at: ${testImagePath}`);
  } catch (error) {
    console.error(`Failed to create test file: ${error.message}`);
  }
};

// Create test image after server starts
app.on('listening', () => {
  createTestImage();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes); // Register admin routes

// Root route
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Add a diagnostic endpoint to check the images directory
app.get('/api/diagnostics/images', (req, res) => {
  try {
    const files = fs.readdirSync(IMAGES_DIR);
    res.json({
      imagesDirectory: IMAGES_DIR,
      exists: true,
      writable: true,
      fileCount: files.length,
      files: files.map(file => ({
        name: file,
        size: fs.statSync(path.join(IMAGES_DIR, file)).size,
        path: path.join(IMAGES_DIR, file)
      }))
    });
  } catch (error) {
    res.status(500).json({
      imagesDirectory: IMAGES_DIR,
      exists: fs.existsSync(IMAGES_DIR),
      error: error.message,
      stack: error.stack
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message || 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Images directory: ${IMAGES_DIR}`);
  
  // Call createTestImage after server starts
  createTestImage();
});
