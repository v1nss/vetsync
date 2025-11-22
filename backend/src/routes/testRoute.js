import express from "express";
import upload from "../../global/config/multer.js"; 
import { testUpload } from "../controllers/testFileUpload.js";
import { uploadFiles } from "../../global/utils/drive.js";

const router = express.Router();

router.post("/test-upload", upload.single("file"), testUpload);

export default router;
