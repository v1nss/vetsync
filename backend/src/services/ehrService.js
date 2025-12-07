import {
  EHR,
  Prescription,
  Vaccination,
  Deworming,
  LabResult,
  Pet,
  PetOwner,
  VetProfessional,
  Clinic,
  Appointment,
} from "../models/index.js";
import User from "../models/users/userModel.js";
import { uploadFiles, deleteMultipleFiles } from "../../global/utils/drive.js";

// Create new EHR record
export const createEHR = async (vetProfessionalId, ehrData, files) => {
  const { 
    pet_owner_id, 
    pet_id, 
    clinic_id, 
    appointment_id, 
    visit_date,
    prescriptions = [],
    vaccinations = [],
    dewormings = [],
    labResults = []
  } = ehrData;

  // Validate required fields
  if (!pet_owner_id || !pet_id || !clinic_id || !visit_date) {
    throw new Error("Missing required fields: pet_owner_id, pet_id, clinic_id, and visit_date are required");
  }

  // Upload attached files if provided
  let attachedFiles = null;
  if (files && files.length > 0) {
    // Filter out any undefined/null files and ensure they have required properties
    const validFiles = files.filter(file => file && file.mimetype);
    
    if (validFiles.length > 0) {
      const uploadedFiles = await Promise.all(
        validFiles.map(file => uploadFiles(file, process.env.EHR_FILES_FOLDER_ID || process.env.GDRIVE_FOLDER_ID))
      );
    
      attachedFiles = uploadedFiles.map(file => ({
        id: file.id,
        name: file.name,
        link: `https://lh3.googleusercontent.com/d/${file.id}`,
        viewLink: file.webViewLink,
        downloadLink: file.webContentLink,
        directLink: `https://drive.google.com/uc?export=view&id=${file.id}`,
        thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`
      }));
    }
  }

  // Create EHR record
  const ehr = await EHR.create({
    pet_owner_id,
    pet_id,
    vet_professional_id: vetProfessionalId,
    clinic_id,
    appointment_id: appointment_id || null,
    visit_date,
    attached_files: attachedFiles,
  });

  // Create related records
  if (prescriptions && prescriptions.length > 0) {
    await Prescription.bulkCreate(
      prescriptions.map(p => ({ ...p, ehr_id: ehr.id }))
    );
  }

  if (vaccinations && vaccinations.length > 0) {
    await Vaccination.bulkCreate(
      vaccinations.map(v => ({ ...v, ehr_id: ehr.id }))
    );
  }

  if (dewormings && dewormings.length > 0) {
    await Deworming.bulkCreate(
      dewormings.map(d => ({ ...d, ehr_id: ehr.id }))
    );
  }

  if (labResults && labResults.length > 0) {
    await LabResult.bulkCreate(
      labResults.map(l => ({ ...l, ehr_id: ehr.id }))
    );
  }

  // Return EHR with all related data
  return getEHRById(ehr.id);
};

// Get EHR by ID with all related data
export const getEHRById = async (ehrId) => {
  const ehr = await EHR.findByPk(ehrId, {
    include: [
      {
        model: PetOwner,
        as: "petOwner",
        attributes: ["user_id", "address"],
      },
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed", "birthdate", "gender"],
      },
      {
        model: VetProfessional,
        as: "vetProfessional",
        attributes: ["user_id"],
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["clinic_id", "name", "contact_number", "email"],
      },
      {
        model: Appointment,
        as: "appointment",
        attributes: ["appointment_id", "date", "time", "status"],
      },
      {
        model: Prescription,
        as: "prescriptions",
      },
      {
        model: Vaccination,
        as: "vaccinations",
      },
      {
        model: Deworming,
        as: "dewormings",
      },
      {
        model: LabResult,
        as: "labResults",
      },
    ],
  });

  if (!ehr) {
    throw new Error("EHR record not found");
  }

  return ehr;
};

// Get all EHRs for a pet owner
export const getEHRsByPetOwner = async (petOwnerId) => {
  return await EHR.findAll({
    where: { pet_owner_id: petOwnerId },
    include: [
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed"],
      },
      {
        model: VetProfessional,
        as: "vetProfessional",
        attributes: ["user_id"],
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["clinic_id", "name"],
      },
      {
        model: Appointment,
        as: "appointment",
        attributes: ["appointment_id", "date", "time"],
      },
    ],
    order: [["visit_date", "DESC"], ["createdAt", "DESC"]],
  });
};

// Get all EHRs for a specific pet
// If petOwnerId is provided, filter by it. Otherwise, get all EHRs for the pet.
export const getEHRsByPet = async (petId, petOwnerId = null) => {
  const whereClause = { pet_id: petId };
  if (petOwnerId) {
    whereClause.pet_owner_id = petOwnerId;
  }
  
  return await EHR.findAll({
    where: whereClause,
    include: [
      {
        model: VetProfessional,
        as: "vetProfessional",
        attributes: ["user_id"],
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name", "email"],
          },
        ],
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["clinic_id", "name"],
      },
      {
        model: Appointment,
        as: "appointment",
        attributes: ["appointment_id", "service", "date", "time"],
      },
      {
        model: Prescription,
        as: "prescriptions",
      },
      {
        model: Vaccination,
        as: "vaccinations",
      },
      {
        model: Deworming,
        as: "dewormings",
      },
      {
        model: LabResult,
        as: "labResults",
      },
    ],
    order: [["visit_date", "DESC"], ["createdAt", "DESC"]],
  });
};

// Get all EHRs for a vet professional
export const getEHRsByVetProfessional = async (vetProfessionalId) => {
  return await EHR.findAll({
    where: { vet_professional_id: vetProfessionalId },
    include: [
      {
        model: PetOwner,
        as: "petOwner",
        attributes: ["user_id"],
      },
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed"],
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["clinic_id", "name"],
      },
    ],
    order: [["visit_date", "DESC"], ["createdAt", "DESC"]],
  });
};

// Get all EHRs for a clinic
export const getEHRsByClinic = async (clinicId) => {
  return await EHR.findAll({
    where: { clinic_id: clinicId },
    include: [
      {
        model: PetOwner,
        as: "petOwner",
        attributes: ["user_id"],
      },
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed"],
      },
      {
        model: VetProfessional,
        as: "vetProfessional",
        attributes: ["user_id"],
      },
    ],
    order: [["visit_date", "DESC"], ["createdAt", "DESC"]],
  });
};

// Update EHR record
export const updateEHR = async (ehrId, vetProfessionalId, updateData, files) => {
  const ehr = await EHR.findOne({
    where: { 
      id: ehrId,
      vet_professional_id: vetProfessionalId 
    },
  });

  if (!ehr) {
    throw new Error("EHR record not found or you don't have permission to update it");
  }

  // Handle file uploads if provided
  if (files && files.length > 0) {
    // Filter out any undefined/null files and ensure they have required properties
    const validFiles = files.filter(file => file && file.mimetype);
    
    if (validFiles.length > 0) {
      const uploadedFiles = await Promise.all(
        validFiles.map(file => uploadFiles(file, process.env.EHR_FILES_FOLDER_ID || process.env.GDRIVE_FOLDER_ID))
      );
      
      const newFiles = uploadedFiles.map(file => ({
        id: file.id,
        name: file.name,
        link: `https://lh3.googleusercontent.com/d/${file.id}`,
        viewLink: file.webViewLink,
        downloadLink: file.webContentLink,
        directLink: `https://drive.google.com/uc?export=view&id=${file.id}`,
        thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`
      }));

      // Merge with existing files
      const existingFiles = ehr.attached_files || [];
      updateData.attached_files = [...existingFiles, ...newFiles];
    }
  }

  // Update EHR
  await ehr.update(updateData);

  // Update related records if provided
  if (updateData.prescriptions) {
    await Prescription.destroy({ where: { ehr_id: ehrId } });
    if (updateData.prescriptions.length > 0) {
      await Prescription.bulkCreate(
        updateData.prescriptions.map(p => ({ ...p, ehr_id: ehrId }))
      );
    }
  }

  if (updateData.vaccinations) {
    await Vaccination.destroy({ where: { ehr_id: ehrId } });
    if (updateData.vaccinations.length > 0) {
      await Vaccination.bulkCreate(
        updateData.vaccinations.map(v => ({ ...v, ehr_id: ehrId }))
      );
    }
  }

  if (updateData.dewormings) {
    await Deworming.destroy({ where: { ehr_id: ehrId } });
    if (updateData.dewormings.length > 0) {
      await Deworming.bulkCreate(
        updateData.dewormings.map(d => ({ ...d, ehr_id: ehrId }))
      );
    }
  }

  if (updateData.labResults) {
    await LabResult.destroy({ where: { ehr_id: ehrId } });
    if (updateData.labResults.length > 0) {
      await LabResult.bulkCreate(
        updateData.labResults.map(l => ({ ...l, ehr_id: ehrId }))
      );
    }
  }

  return getEHRById(ehrId);
};

// Delete EHR record
export const deleteEHR = async (ehrId, vetProfessionalId) => {
  const ehr = await EHR.findOne({
    where: { 
      id: ehrId,
      vet_professional_id: vetProfessionalId 
    },
  });

  if (!ehr) {
    throw new Error("EHR record not found or you don't have permission to delete it");
  }

  // Delete attached files from Google Drive if they exist
  if (ehr.attached_files && Array.isArray(ehr.attached_files)) {
    const fileIds = ehr.attached_files
      .map(file => file.id)
      .filter(Boolean);
    
    if (fileIds.length > 0) {
      await deleteMultipleFiles(fileIds);
    }
  }

  // Delete related records (CASCADE should handle this, but being explicit)
  await Prescription.destroy({ where: { ehr_id: ehrId } });
  await Vaccination.destroy({ where: { ehr_id: ehrId } });
  await Deworming.destroy({ where: { ehr_id: ehrId } });
  await LabResult.destroy({ where: { ehr_id: ehrId } });

  // Delete EHR
  await ehr.destroy();

  return { message: "EHR record deleted successfully" };
};

// Delete file from EHR
export const deleteEHRFile = async (ehrId, fileId, vetProfessionalId) => {
  const ehr = await EHR.findOne({
    where: { 
      id: ehrId,
      vet_professional_id: vetProfessionalId 
    },
  });

  if (!ehr) {
    throw new Error("EHR record not found or you don't have permission to modify it");
  }

  const attachedFiles = ehr.attached_files || [];
  const fileToDelete = attachedFiles.find(f => f.id === fileId);

  if (!fileToDelete) {
    throw new Error("File not found in EHR record");
  }

  // Delete from Google Drive
  await deleteMultipleFiles([fileId]);

  // Remove from EHR record
  const updatedFiles = attachedFiles.filter(f => f.id !== fileId);
  await ehr.update({ attached_files: updatedFiles });

  return getEHRById(ehrId);
};

