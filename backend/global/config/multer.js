import multer from 'multer';

// Multer config for images only (used for profile pictures, clinic images, etc.)
const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: (req, file, cb) => {
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if(validTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed."), false);
        }
    }
});

// Multer config for EHR files (allows images, PDFs, and documents)
export const uploadEHRFiles = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size for EHR files
    },
    fileFilter: (req, file, cb) => {
        const validTypes = [
            "image/png", 
            "image/jpeg", 
            "image/jpg", 
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
        ];
        if(validTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images, PDFs, and documents are allowed."), false);
        }
    }
});

export default upload;