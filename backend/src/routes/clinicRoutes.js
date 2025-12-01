import express from "express";
import { fetchMyClinic, fetchClinicByOwnerId, registerNewClinic, updateClinicDetails, fetchApprovedClinics, fetchClinicById, searchClinics } from "../controllers/clinicController.js";
import { authenticate, verifyClinicAdmin } from "../../global/middleware/authMiddleware.js";
import upload from "../../global/config/multer.js";

const router = express.Router();

// register new clinic - only clinic admins
// Handle multiple file uploads for clinic images and documents
router.post("/register", 
  authenticate, 
  verifyClinicAdmin, 
  upload.fields([
    { name: 'clinicImages', maxCount: 10 },
    { name: 'documentImages', maxCount: 10 }
  ]),
  registerNewClinic
);

// update clinic details - only clinic admins
router.patch("/update/:clinicId", 
  authenticate, 
  verifyClinicAdmin,
  upload.fields([
    { name: 'clinicImages', maxCount: 10 },
    { name: 'documentImages', maxCount: 10 }
  ]),
  updateClinicDetails
)

router.get("/approved", fetchApprovedClinics);

router.get("/search", searchClinics);

router.get("/public/:clinicId", fetchClinicById);

router.get("/get-clinic/:ownerId", authenticate, verifyClinicAdmin, fetchClinicByOwnerId);

// Get current admin's clinic - PUT THIS BEFORE THE :ownerId ROUTE
router.get("/my-clinic", authenticate, verifyClinicAdmin, fetchMyClinic);

export default router;