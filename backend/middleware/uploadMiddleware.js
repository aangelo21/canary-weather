import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración para fotos de perfil
const profilePictureDir = path.join(__dirname, "..", "uploads", "profile-pictures");

if (!fs.existsSync(profilePictureDir)) {
    fs.mkdirSync(profilePictureDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profilePictureDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, "profile-" + uniqueSuffix + ext);
    },
});

// Configuración para imágenes de POIs
const poiImageDir = path.join(__dirname, "..", "uploads", "poi-images");

if (!fs.existsSync(poiImageDir)) {
    fs.mkdirSync(poiImageDir, { recursive: true });
}

const poiStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, poiImageDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, "poi-" + uniqueSuffix + ext);
    },
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
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

export const upload = multer({
    storage: profileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export const uploadPOI = multer({
    storage: poiStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
