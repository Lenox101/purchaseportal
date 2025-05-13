const db = require('../../../config/db');
const fs = require('fs');
const { readImageFile, deleteImageFile } = require('../../../utils/image-utils');

// Get product main image
const getProductMainImage = async (req, res) => {
  try {
    const [products] = await db.pool.query('SELECT image_path, image_type FROM products WHERE id = ?', [req.params.id]);
    
    if (products.length === 0 || !products[0].image_path) {
      // Check if there's a primary image in product_images
      const [primaryImages] = await db.pool.query(
        'SELECT image_path, image_type FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1',
        [req.params.id]
      );
      
      if (primaryImages.length === 0 || !primaryImages[0].image_path) {
        return res.status(404).json({ message: 'Product image not found' });
      }
      
      console.log(`Loading primary image from path: ${primaryImages[0].image_path}`);
      return serveImageToResponse(primaryImages[0].image_path, primaryImages[0].image_type, res);
    }
    
    console.log(`Loading main product image from path: ${products[0].image_path}`);
    return serveImageToResponse(products[0].image_path, products[0].image_type, res);
  } catch (error) {
    console.error('Error loading product image:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get specific product image by image ID
const getProductImageById = async (req, res) => {
  try {
    const [images] = await db.pool.query('SELECT image_path, image_type FROM product_images WHERE id = ?', [req.params.imageId]);
    
    if (images.length === 0 || !images[0].image_path) {
      return res.status(404).json({ message: 'Product image not found' });
    }
    
    console.log(`Loading product image from path: ${images[0].image_path}`);
    return serveImageToResponse(images[0].image_path, images[0].image_type, res);
  } catch (error) {
    console.error('Error loading product image:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a product image
const deleteProductImage = async (req, res) => {
  try {
    // Check if image exists and get product_id and image_path
    const [image] = await db.pool.query('SELECT product_id, image_path FROM product_images WHERE id = ?', [req.params.imageId]);
    
    if (image.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete the image file if it exists
    let fileDeleted = false;
    if (image[0].image_path) {
      fileDeleted = deleteImageFile(image[0].image_path);
      if (fileDeleted) {
        console.log(`Successfully deleted image file: ${image[0].image_path}`);
      } else {
        console.warn(`Could not delete image file: ${image[0].image_path}`);
      }
    }
    
    // Remove the image record from the database
    await db.pool.query('DELETE FROM product_images WHERE id = ?', [req.params.imageId]);
    
    res.json({ 
      message: 'Image deleted successfully', 
      fileDeleted: fileDeleted 
    });
  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to serve image content to response
const serveImageToResponse = (imagePath, imageType, res) => {
  let effectiveImagePath = imagePath;
  const workspaceDir = 'C:\\Users\\Lenox Randy\\Desktop\\PrimePicksFull\\';
  const incorrectSegment = 'purchaseportal\\backend\\images\\';
  const correctSegment = 'backend\\images\\';

  if (imagePath && imagePath.startsWith(workspaceDir) && imagePath.includes(incorrectSegment, workspaceDir.length)) {
    // Replace the incorrect segment with the correct one
    effectiveImagePath = imagePath.replace(incorrectSegment, correctSegment);
    console.log(`Attempting to load image from corrected path: ${effectiveImagePath}`);
  } else {
    console.log(`Using original image path: ${imagePath}`);
  }


  // Check if image exists in the images directory using the effective path
  if (fs.existsSync(effectiveImagePath)) {
    // Serve the image directly from the file system
    res.setHeader('Content-Type', imageType || 'image/jpeg');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return fs.createReadStream(effectiveImagePath).pipe(res);
  }

  // If effective path didn't work, try the original path with LOAD_FILE and direct read
  // Try to get the image data using LOAD_FILE
  // Note: LOAD_FILE might require the exact path stored in the database,
  // so we use the original imagePath here.
  return db.pool.query('SELECT LOAD_FILE(?) as image', [imagePath])
    .then(([imageData]) => {
      // If LOAD_FILE fails, try direct file read using the original path
      if (!imageData[0].image) {
        console.log(`LOAD_FILE failed, trying direct file read for: ${imagePath}`);
        const fileData = readImageFile(imagePath); // readImageFile also handles normalization

        if (!fileData) {
          console.error(`Failed to load image from path: ${imagePath}`);
          return res.status(404).json({ message: 'Image file could not be loaded from server' });
        }

        // Set the appropriate content type and send the binary image data
        res.setHeader('Content-Type', imageType || 'image/jpeg');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.send(fileData);
      }

      // Set the appropriate content type and send the binary image data
      res.setHeader('Content-Type', imageType || 'image/jpeg');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.send(Buffer.from(imageData[0].image));
    })
    .catch(error => { // Add catch for the promise chain
        console.error('Error in serveImageToResponse after initial file check:', error);
        res.status(500).json({ message: error.message });
    });
};

module.exports = {
  getProductMainImage,
  getProductImageById,
  deleteProductImage
};
