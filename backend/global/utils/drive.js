import {google} from 'googleapis'
import fs from 'fs'
import authorize from '../config/gDrive'

// Upload files
export const uploadFiles = async (fileObject, folder_id) => {
    try {
        const {data} = await google 
            .drive({ version: "v3", auth: authorize})
            .files.create({
                media: {
                    mimeType: fileObject.mimeType,
                    body: fs.createReadStream(fileObject.path),
                },
                requestBody: {
                    name: fileObject.originalname,
                    parents: [folder_id],
                },
                fields: 'id,name',
            });

            return data;
    } catch (err) {
        console.log(err.message);
    }
};

export const deleteFiles = async (fileID) => {
    try {
        const {data} = await google
            .drive({version: 'v3', auth: authorize})
            .files.detele({
                fileId: fileID,
            });

            return data;
    } catch (err) {
        console.log(err.message);
    }
}