import express from "express";
import { authenticate, verifyVetOrClinicAdmin } from "../../global/middleware/authMiddleware.js";
import {
  getVetClinicPatients,
  getVetClinicPatient,
  getVetClinicEHRs,
  searchPetsByEmail,
  addPatient,
  getMyClinicServices,
} from "../controllers/clinicPatientController.js";

const router = express.Router();

// Get all patients for clinic (works for both vet professional and clinic admin)
router.get("/vet/patients", authenticate, verifyVetOrClinicAdmin, getVetClinicPatients);

// Get a specific patient by pet_id (works for both vet professional and clinic admin)
router.get("/vet/patients/:petId", authenticate, verifyVetOrClinicAdmin, getVetClinicPatient);

// Get all EHRs for all patients in the clinic (works for both vet professional and clinic admin)
router.get("/vet/ehrs", authenticate, verifyVetOrClinicAdmin, getVetClinicEHRs);

// Search pets by owner email (works for both vet professional and clinic admin)
router.get("/search-pets", authenticate, verifyVetOrClinicAdmin, searchPetsByEmail);

// Add patient to clinic (works for both vet professional and clinic admin)
router.post("/add-patient", authenticate, verifyVetOrClinicAdmin, addPatient);

// Get clinic services (works for both vet professional and clinic admin)
router.get("/my-clinic/services", authenticate, verifyVetOrClinicAdmin, getMyClinicServices);

export default router;

