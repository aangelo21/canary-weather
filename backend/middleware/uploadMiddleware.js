// Import multer for handling multipart/form-data uploads
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for profile picture uploads
const profilePictureDir = path.join(__dirname, "..", "uploads", "profile-pictures");

// Ensure the profile pictures directory exists
if (!fs.existsSync(profilePictureDir)) {
    fs.mkdirSync(profilePictureDir, { recursive: true });
}

// Storage configuration for profile pictures
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set destination directory for profile pictures
        cb(null, profilePictureDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp and random number
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, "profile-" + uniqueSuffix + ext);
    },
});

// Configuration for POI image uploads
const poiImageDir = path.join(__dirname, "..", "uploads", "poi-images");

// Ensure the POI images directory exists
if (!fs.existsSync(poiImageDir)) {
    fs.mkdirSync(poiImageDir, { recursive: true });
}

// Storage configuration for POI images
const poiStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set destination directory for POI images
        cb(null, poiImageDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp and random number
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, "poi-" + uniqueSuffix + ext);
    },
});

// File filter to allow only image files
const fileFilter = function (req, file, cb) {
    // Define allowed file types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    // Check file extension
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Check MIME type
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(
            new Error(
                "Only image files are allowed (jpeg, jpg, png, gif, webp)"
            )
        );
    }
};

// Multer instance for profile picture uploads
export const upload = multer({
    storage: profileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Multer instance for POI image uploads
export const uploadPOI = multer({
    storage: poiStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
