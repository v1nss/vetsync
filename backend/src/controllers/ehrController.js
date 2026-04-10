import {
  createEHR,
  getEHRById,
  getEHRsByPetOwner,
  getEHRsByPet,
  getEHRsByVetProfessional,
  getEHRsByClinic,
  updateEHR,
  deleteEHR,
  deleteEHRFile,
} from "../services/ehrService.js";

// Create new EHR record
export const createNewEHR = async (req, res) => {
  try {
    const vetProfessionalId = req.user.id; // from JWT
    const ehrData = JSON.parse(req.body.ehr || "{}");
    
    // Handle file uploads - check for files array or single file
    let files = [];
    if (req.files) {
      if (req.files.files) {
        // If files is an array, use it; if single file, wrap in array
        files = Array.isArray(req.files.files) 
          ? req.files.files.filter(file => file) // Filter out any undefined/null values
          : [req.files.files].filter(file => file);
      }
    }

    const newEHR = await createEHR(vetProfessionalId, ehrData, files);

    res.status(201).json({
      message: "EHR record created successfully",
      ehr: newEHR,
    });
  } catch (err) {
    console.error("Error creating EHR:", err);
    res.status(500).json({
      message: "Error creating EHR record",
      error: err.message,
    });
  }
};

// Get EHR by ID
export const getEHR = async (req, res) => {
  try {
    const { ehrId } = req.params;
    const ehr = await getEHRById(ehrId);

    res.status(200).json({
      message: "EHR record fetched successfully",
      ehr,
    });
  } catch (err) {
    console.error("Error fetching EHR:", err);
    res.status(404).json({
      message: "EHR record not found",
      error: err.message,
    });
  }
};

// Get all EHRs for pet owner
export const getPetOwnerEHRs = async (req, res) => {
  try {
    const petOwnerId = req.user.id; // from JWT
    const ehrs = await getEHRsByPetOwner(petOwnerId);

    res.status(200).json({
      message: "EHR records fetched successfully",
      ehrs,
    });
  } catch (err) {
    console.error("Error fetching EHRs:", err);
    res.status(500).json({
      message: "Error fetching EHR records",
      error: err.message,
    });
  }
};

// Get all EHRs for a specific pet
// Pet owners can view their pet's EHRs, vet professionals can view their clinic's patients' EHRs
export const getPetEHRs = async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user.id; // from JWT
    const userType = req.user.user_type; // from JWT

    let ehrs;
    
    if (userType === 'pet_owner') {
      ehrs = await getEHRsByPet(petId, userId);
    } else {
      ehrs = await getEHRsByPet(petId);
    }

    res.status(200).json({
      message: "EHR records fetched successfully",
      ehrs,
    });
  } catch (err) {
    console.error("Error fetching pet EHRs:", err);
    res.status(500).json({
      message: "Error fetching pet EHR records",
      error: err.message,
    });
  }
};

// Get all EHRs for vet professional
export const getVetProfessionalEHRs = async (req, res) => {
  try {
    const vetProfessionalId = req.user.id; // from JWT
    const ehrs = await getEHRsByVetProfessional(vetProfessionalId);

    res.status(200).json({
      message: "EHR records fetched successfully",
      ehrs,
    });
  } catch (err) {
    console.error("Error fetching vet professional EHRs:", err);
    res.status(500).json({
      message: "Error fetching vet professional EHR records",
      error: err.message,
    });
  }
};

// Get all EHRs for clinic
export const getClinicEHRs = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const ehrs = await getEHRsByClinic(clinicId);

    res.status(200).json({
      message: "EHR records fetched successfully",
      ehrs,
    });
  } catch (err) {
    console.error("Error fetching clinic EHRs:", err);
    res.status(500).json({
      message: "Error fetching clinic EHR records",
      error: err.message,
    });
  }
};

// Update EHR record
export const updateEHRRecord = async (req, res) => {
  try {
    const { ehrId } = req.params;
    const vetProfessionalId = req.user.id; // from JWT
    const updateData = JSON.parse(req.body.ehr || "{}");
    
    // Handle file uploads - check for files array or single file
    let files = [];
    if (req.files) {
      if (req.files.files) {
        // If files is an array, use it; if single file, wrap in array
        files = Array.isArray(req.files.files) 
          ? req.files.files.filter(file => file) // Filter out any undefined/null values
          : [req.files.files].filter(file => file);
      }
    }

    const updatedEHR = await updateEHR(ehrId, vetProfessionalId, updateData, files);

    res.status(200).json({
      message: "EHR record updated successfully",
      ehr: updatedEHR,
    });
  } catch (err) {
    console.error("Error updating EHR:", err);
    res.status(500).json({
      message: "Error updating EHR record",
      error: err.message,
    });
  }
};

// Delete EHR record
export const deleteEHRRecord = async (req, res) => {
  try {
    const { ehrId } = req.params;
    const vetProfessionalId = req.user.id; // from JWT

    const result = await deleteEHR(ehrId, vetProfessionalId);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting EHR:", err);
    res.status(500).json({
      message: "Error deleting EHR record",
      error: err.message,
    });
  }
};

// Delete file from EHR
export const deleteFileFromEHR = async (req, res) => {
  try {
    const { ehrId, fileId } = req.params;
    const vetProfessionalId = req.user.id; // from JWT

    const updatedEHR = await deleteEHRFile(ehrId, fileId, vetProfessionalId);

    res.status(200).json({
      message: "File deleted successfully",
      ehr: updatedEHR,
    });
  } catch (err) {
    console.error("Error deleting file from EHR:", err);
    res.status(500).json({
      message: "Error deleting file",
      error: err.message,
    });
  }
};

