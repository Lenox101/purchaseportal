
const fs = require('fs');
const path = require('path');

// Helper function to safely read image file contents
const readImageFile = (imagePath) => {
  try {
    if (!imagePath) return null;
    // Normalize backslashes to match file system format
    const normalizedPath = imagePath.replace(/\\\\/g, '\\');
    if (fs.existsSync(normalizedPath)) {
      return fs.readFileSync(normalizedPath);
    }
    return null;
  } catch (error) {
    console.error('Error reading image file:', error);
    return null;
  }
};

// Helper function to save base64 image data to file
const saveBase64Image = (base64Data, imageType, imagesDir) => {
  try {
    // Extract the base64 string (remove data:image/jpeg;base64, part)
    const base64Image = base64Data.split(';base64,').pop();
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = imageType.split('/')[1] || 'jpg';
    const filename = uniqueSuffix + '.' + ext;
    const imagePath = path.join(imagesDir, filename);
    
    // Save the file to disk
    fs.writeFileSync(imagePath, base64Image, { encoding: 'base64' });
    console.log(`Saved base64 image to: ${imagePath}`);
    
    return imagePath;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    throw error;
  }
};

// Helper function to safely delete an image file
const deleteImageFile = (imagePath) => {
  if (!imagePath) return false;
  
  try {
    // Normalize the file path
    const normalizedPath = imagePath.replace(/\\\\/g, '\\');
    
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image file:', error);
    return false;
  }
};

module.exports = {
  readImageFile,
  saveBase64Image,
  deleteImageFile
};
