import {google} from 'googleapis'
import fs from 'fs'
import authorize from '../config/gDrive.js'
import oauth2Client from '../config/oauth.js';

// Upload files
export const uploadFiles = async (file, folder_id) => {
  try {
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
      fields: "id,name",
    });

    await drive.permissions.create({
      fileId: data.id,
      requestBody: {
        type: "anyone",
        role: "reader",
      }
    });

    // delete the local file after upload
    fs.unlinkSync(file.path);

    return data;
  } catch (err) {
    console.error("Upload Service Error:", err.message);
    throw err; // propagate error to controller
  }
};

export const deleteFiles = async (fileID) => {
    try {
        const {data} = await google
            .drive({version: 'v3', auth: authorize})
            .files.delete({
                fileId: fileID,
            });

            return data;
    } catch (err) {
        console.log(err.message);
    }
}