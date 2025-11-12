import express from "express";
import { fetchClinicByOwnerId, registerNewClinic, updateClinicDetails } from "../controllers/clinicController.js";
import { verifyToken, verifyClinicAdmin } from "../global/middleware/authMiddleware.js";

const router = express.Router();

// register new clinic - only clinic admins
router.post("/register", verifyToken, verifyClinicAdmin, registerNewClinic);

// update clinic details - only clinic admins
router.patch("/update/:clinicId", verifyToken, verifyClinicAdmin, updateClinicDetails)

router.get("/get-clinic/:ownerId", verifyToken, verifyClinicAdmin, fetchClinicByOwnerId);

export default router;