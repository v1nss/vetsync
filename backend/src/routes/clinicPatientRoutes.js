import express from "express";
import { authenticate, verifyVetOrClinicAdmin } from "../../global/middleware/authMiddleware.js";
import {
  getVetClinicPatients,
  getVetClinicPatient,
  getVetClinicEHRs,
} from "../controllers/clinicPatientController.js";

const router = express.Router();

// Get all patients for clinic (works for both vet professional and clinic admin)
router.get("/vet/patients", authenticate, verifyVetOrClinicAdmin, getVetClinicPatients);

// Get a specific patient by pet_id (works for both vet professional and clinic admin)
router.get("/vet/patients/:petId", authenticate, verifyVetOrClinicAdmin, getVetClinicPatient);

// Get all EHRs for all patients in the clinic (works for both vet professional and clinic admin)
router.get("/vet/ehrs", authenticate, verifyVetOrClinicAdmin, getVetClinicEHRs);

export default router;

