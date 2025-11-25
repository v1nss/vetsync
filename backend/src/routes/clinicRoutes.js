import express from "express";
import { fetchMyClinic, fetchClinicByOwnerId, registerNewClinic, updateClinicDetails } from "../controllers/clinicController.js";
import { authenticate, verifyClinicAdmin } from "../../global/middleware/authMiddleware.js";

const router = express.Router();

// register new clinic - only clinic admins
router.post("/register", authenticate, verifyClinicAdmin, registerNewClinic);

// update clinic details - only clinic admins
router.patch("/update/:clinicId", authenticate, verifyClinicAdmin, updateClinicDetails)

router.get("/get-clinic/:ownerId", authenticate, verifyClinicAdmin, fetchClinicByOwnerId);

// Get current admin's clinic - PUT THIS BEFORE THE :ownerId ROUTE
router.get("/my-clinic", authenticate, verifyClinicAdmin, fetchMyClinic);

export default router;