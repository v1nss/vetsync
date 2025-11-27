import { getClinicByOwnerId, registerClinic, updateClinic } from "../services/clinicService.js";
import { uploadFiles, deleteMultipleFiles } from "../../global/utils/drive.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import Clinic from "../models/clinicModel.js";

// Helper function to upload multiple files to Google Drive
const uploadMultipleFiles = async (files, folderId) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map(file => uploadFiles(file, folderId));
  const uploadedFiles = await Promise.all(uploadPromises);
  
  // Return array of file metadata with multiple link formats for reliability
  return uploadedFiles.map(file => ({
    id: file.id,
    name: file.name,
    // Primary link - Googleusercontent 
    link: `https://lh3.googleusercontent.com/d/${file.id}`,
    // Alternative links for fallback
    viewLink: file.webViewLink,
    downloadLink: file.webContentLink,
    // Direct view link (backup)
    directLink: `https://drive.google.com/uc?export=view&id=${file.id}`,
    // Thumbnail link for optimization
    thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`
  }));
};

export const registerNewClinic = async (req, res) => {
  try {
    const adminUserId = req.user.id; // from JWT
    const clinicData = JSON.parse(req.body.clinic || '{}');
    
    // Google Drive folder IDs
    const CLINIC_IMAGES_FOLDER_ID = process.env.CLINIC_IMAGES_FOLDER_ID;
    const DOCUMENT_IMAGES_FOLDER_ID = process.env.DOCUMENT_IMAGES_FOLDER_ID;
    
    // Upload clinic images if provided
    let clinicImages = [];
    if (req.files?.clinicImages) {
      clinicImages = await uploadMultipleFiles(req.files.clinicImages, CLINIC_IMAGES_FOLDER_ID);
    }
    
    // Upload document images if provided
    let documentImages = [];
    if (req.files?.documentImages) {
      documentImages = await uploadMultipleFiles(req.files.documentImages, DOCUMENT_IMAGES_FOLDER_ID);
    }
    
    // Add image data to clinic data
    clinicData.clinic_images = clinicImages;
    clinicData.document_images = documentImages;

      const admin = await ClinicAdmin.findOne({ where: { user_id: adminUserId } });
  if (!admin) throw new Error("Only clinic admins can register clinics");

//   const { name, address, contact_number, email } = clinicData; //for validation if needed

  const newClinic = await Clinic.create({
    owner_id: adminUserId,
    ...clinicData,
  });
  // return newClinic;
    
  //   const newClinic = await registerClinic(clinicData, adminUserId);
    
   return res
      .status(201)
      .json({ 
        message: "Clinic registered successfully", 
        clinic: newClinic 
      });
  } catch (error) {
    console.error("Error from clinic controller:", error);
    res
      .status(500)
      .json({ message: "Error registering clinic", error: error.message });
  }
}

export const updateClinicDetails = async (req, res) => {
  try {
    const adminUserId = req.user.id; // from JWT
    const clinicId = req.params.clinicId;
    const updateData = JSON.parse(req.body.clinic || '{}');
    
    // Get current clinic data to find deleted images
    const currentClinic = await getClinicByOwnerId(adminUserId);
    
    // Google Drive folder IDs
    const CLINIC_IMAGES_FOLDER_ID = process.env.CLINIC_IMAGES_FOLDER_ID;
    const DOCUMENT_IMAGES_FOLDER_ID = process.env.DOCUMENT_IMAGES_FOLDER_ID;
    
    // Find deleted clinic images
    const deletedClinicImageIds = (currentClinic.clinic_images || [])
      .filter(oldImg => !(updateData.clinic_images || []).some(newImg => newImg.id === oldImg.id))
      .map(img => img.id)
      .filter(Boolean);
    
    // Find deleted document images
    const deletedDocImageIds = (currentClinic.document_images || [])
      .filter(oldImg => !(updateData.document_images || []).some(newImg => newImg.id === oldImg.id))
      .map(img => img.id)
      .filter(Boolean);
    
    // Delete removed images from Google Drive
    if (deletedClinicImageIds.length > 0) {
      console.log(`Deleting ${deletedClinicImageIds.length} clinic images from Drive`);
      await deleteMultipleFiles(deletedClinicImageIds);
    }
    
    if (deletedDocImageIds.length > 0) {
      console.log(`Deleting ${deletedDocImageIds.length} document images from Drive`);
      await deleteMultipleFiles(deletedDocImageIds);
    }
    
    // Upload new clinic images if provided
    if (req.files?.clinicImages) {
      const newClinicImages = await uploadMultipleFiles(req.files.clinicImages, CLINIC_IMAGES_FOLDER_ID);
      // Merge with existing images
      updateData.clinic_images = [...(updateData.clinic_images || []), ...newClinicImages];
    }
    
    // Upload new document images if provided
    if (req.files?.documentImages) {
      const newDocumentImages = await uploadMultipleFiles(req.files.documentImages, DOCUMENT_IMAGES_FOLDER_ID);
      // Merge with existing images
      updateData.document_images = [...(updateData.document_images || []), ...newDocumentImages];
    }
    
    const updatedClinic = await updateClinic(clinicId, updateData, adminUserId);

    res
      .status(200)
      .json({ 
        message: "Clinic details updated successfully", 
        clinic: updatedClinic,
        deletedImages: {
          clinic: deletedClinicImageIds.length,
          documents: deletedDocImageIds.length
        }
      });

  } catch (err) {
    console.error("Error updating clinic details", err.message);
    res
      .status(500)
      .json({ message: "Error updating clinic details", error: err.message });
  }
}

export const fetchClinicByOwnerId = async (req, res) => {
  try {
    const ownerId = req.params.ownerId
    const clinic = await getClinicByOwnerId(ownerId);

    if (!clinic) {
      return res.status(200).json({
        message: "No clinic registered yet", 
        clinic: null,
        hasClinic: false
      });
    }

    res.status(200).json({
      message: "Clinic fetched successfully", 
      clinic: clinic,
      hasClinic: true
    });
  } catch (err) {
    console.error("Unable to fetch Clinic Data using Owner ID", err.message);
    res.status(500).json({ 
      message: "Error fetching clinic", 
      error: err.message 
    });
  }
}

export const fetchMyClinic = async (req, res) => {
  try {
    const ownerId = req.user.id; // from JWT
    const clinic = await getClinicByOwnerId(ownerId);

    if (!clinic) {
      // Not an error - admin just hasn't registered a clinic yet
      return res.status(200).json({ 
        message: "No clinic registered yet", 
        clinic: null,
        hasClinic: false 
      });
    }

    res.status(200).json({ 
      message: "Clinic fetched successfully", 
      clinic: clinic,
      hasClinic: true 
    });
  } catch (err) {
    console.error("Unable to fetch Clinic Data", err.message);
    res.status(500).json({ message: "Error fetching clinic", error: err.message });
  }
};