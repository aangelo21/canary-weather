import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Middleware to optimize uploaded images and convert them to WebP.
 * Should be placed after multer middleware.
 */
export const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const file = req.file;
    const originalPath = file.path;
    const directory = path.dirname(originalPath);
    const filename = path.basename(originalPath, path.extname(originalPath));
    
    // Define the new filename with .webp extension
    const newFilename = `${filename}.webp`;
    const newPath = path.join(directory, newFilename);

    // Optimize and convert to WebP using sharp
    // Handle case where input and output paths are the same (e.g. uploading a webp file)
    if (originalPath === newPath) {
        const tempPath = newPath + '.tmp';
        await sharp(originalPath)
            .webp({ quality: 60 })
            .toFile(tempPath);
        fs.renameSync(tempPath, newPath);
    } else {
        await sharp(originalPath)
            .webp({ quality: 60 })
            .toFile(newPath);
        
        // Delete the original file
        fs.unlinkSync(originalPath);
    }

    // Update req.file properties to point to the new WebP file
    req.file.filename = newFilename;
    req.file.path = newPath;
    req.file.mimetype = 'image/webp';
    req.file.originalname = path.basename(file.originalname, path.extname(file.originalname)) + '.webp';

    next();
  } catch (error) {
    console.error('Error optimizing image:', error);
    next(); 
  }
};
