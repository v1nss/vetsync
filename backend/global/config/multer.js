import multer from 'multer';

export default multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        const validTypes = ["image/png", "image/jpeg", "image/jpg"];
        if(validTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed."), false);
        }
    }
})