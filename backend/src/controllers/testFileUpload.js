import { google } from "googleapis";
import fs from "fs";
import oauth2Client from "../../global/config/oauth.js"; // your JWT/GoogleAuth setup
import { uploadFiles } from "../../global/utils/drive.js";

export const testUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const folder_id = process.env.GDRIVE_FOLDER_ID;

    // Use the service function
    const data = await uploadFiles(req.file, folder_id);

    return res.status(200).json({
      message: "Upload successful!",
      fileId: data.id,
      fileName: data.name,
    });
  } catch (err) {
    console.error("Upload Controller Error:", err.message);
    return res.status(500).json({
      error: "Upload failed",
      details: err.message,
    });
  }
};