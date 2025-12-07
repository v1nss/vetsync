import express from "express";
import { uploadEHRFiles } from "../../global/config/multer.js";
import { authenticate, verifyVetProfessional, verifyOwner, verifyClinicAdmin } from "../../global/middleware/authMiddleware.js";
import {
  createNewEHR,
  getEHR,
  getPetOwnerEHRs,
  getPetEHRs,
  getVetProfessionalEHRs,
  getClinicEHRs,
  updateEHRRecord,
  deleteEHRRecord,
  deleteFileFromEHR,
} from "../controllers/ehrController.js";

const router = express.Router();

// Create new EHR - only vet professionals
router.post("/create", uploadEHRFiles.array("files", 10), authenticate, verifyVetProfessional, createNewEHR);

// Get EHR by ID - accessible by pet owner, vet professional, or clinic admin
router.get("/:ehrId", authenticate, getEHR);

// Get all EHRs for pet owner - pet owners can view their own EHRs
router.get("/owner/all", authenticate, verifyOwner, getPetOwnerEHRs);

// Get all EHRs for a specific pet - pet owners can view their pet's EHRs, vet professionals can view their clinic's patients
router.get("/pet/:petId", authenticate, getPetEHRs);

// Get all EHRs for vet professional - vets can view their own EHRs
router.get("/vet/all", authenticate, verifyVetProfessional, getVetProfessionalEHRs);

// Get all EHRs for clinic - clinic admins can view all EHRs in their clinic
router.get("/clinic/:clinicId", authenticate, verifyClinicAdmin, getClinicEHRs);

// Update EHR - only vet professionals who created it
router.patch("/:ehrId", uploadEHRFiles.array("files", 10), authenticate, verifyVetProfessional, updateEHRRecord);

// Delete EHR - only vet professionals who created it
router.delete("/:ehrId", authenticate, verifyVetProfessional, deleteEHRRecord);

// Delete file from EHR - only vet professionals who created it
router.delete("/:ehrId/file/:fileId", authenticate, verifyVetProfessional, deleteFileFromEHR);

export default router;

