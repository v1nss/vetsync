import {google} from 'googleapis'
import fs from 'fs'
import authorize from '../config/gDrive.js'
import oauth2Client from '../config/oauth.js';

// Upload files
export const uploadFiles = async (file, folder_id) => {
  try {
    // Verify OAuth2 credentials are set
    if (!process.env.REFRESH_TOKEN) {
      throw new Error("REFRESH_TOKEN is not set in environment variables. Google Drive upload requires OAuth2 authentication.");
    }
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
      throw new Error("CLIENT_ID and CLIENT_SECRET must be set in environment variables for Google Drive upload.");
    }

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { data } = await drive.files.create({
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      requestBody: {
        name: file.originalname,
        parents: [folder_id],
      },
      fields: "id,name,webViewLink,webContentLink",
    });

    // Set file permissions to public
    await drive.permissions.create({
      fileId: data.id,
      requestBody: {
        type: "anyone",
        role: "reader",
      },
      fields: "id"
    });

    // Delete the local file after upload
    fs.unlinkSync(file.path);

    return data;
  } catch (err) {
    console.error("Upload Service Error:", err.message);
    console.error("Full error:", err);
    
    // Provide helpful error messages
    if (err.message?.includes("invalid_grant") || err.message?.includes("invalid_token")) {
      throw new Error("Google Drive authentication failed. Your REFRESH_TOKEN may be expired. Please regenerate it.");
    }
    if (err.message?.includes("REFRESH_TOKEN")) {
      throw err; // Already has helpful message
    }
    
    throw err; // propagate error to controller
  }
};

export const deleteFiles = async (fileID) => {
  try {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    await drive.files.delete({
      fileId: fileID,
    });
    
    console.log(`File ${fileID} deleted from Google Drive`);
    return { success: true, fileId: fileID };
  } catch (err) {
    console.error("Delete file error:", err.message);
    throw err;
  }
};

// Delete multiple files
export const deleteMultipleFiles = async (fileIDs) => {
  if (!fileIDs || fileIDs.length === 0) return [];
  
  const deletePromises = fileIDs.map(id => deleteFiles(id));
  const results = await Promise.allSettled(deletePromises);
  
  // Return results with success/failure status
  return results.map((result, index) => ({
    fileId: fileIDs[index],
    success: result.status === 'fulfilled',
    error: result.reason?.message
  }));
};