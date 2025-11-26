import multer from 'multer';

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

export default upload;