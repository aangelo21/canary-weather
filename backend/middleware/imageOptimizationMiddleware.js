import sharp from 'sharp';
import path from 'path';
import fs from 'fs';


export const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const file = req.file;
        const originalPath = file.path;
        const directory = path.dirname(originalPath);
        const filename = path.basename(
            originalPath,
            path.extname(originalPath),
        );

        
        const newFilename = `${filename}.webp`;
        const newPath = path.join(directory, newFilename);

        
        
        if (originalPath === newPath) {
            const tempPath = newPath + '.tmp';
            await sharp(originalPath).webp({ quality: 60 }).toFile(tempPath);
            fs.renameSync(tempPath, newPath);
        } else {
            await sharp(originalPath).webp({ quality: 60 }).toFile(newPath);

            
            fs.unlinkSync(originalPath);
        }

        
        req.file.filename = newFilename;
        req.file.path = newPath;
        req.file.mimetype = 'image/webp';
        req.file.originalname =
            path.basename(file.originalname, path.extname(file.originalname)) +
            '.webp';

        next();
    } catch (error) {
        console.error('Error optimizing image:', error);
        next();
    }
};
