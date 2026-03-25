import express from "express";
import { authenticate, verifyClinicAdmin, verifySystemAdmin } from "../../global/middleware/authMiddleware.js";
import { 
    fetchUserActivityReport, 
    fetchAuditTrail, 
    fetchClinicPerformanceReport,
    downloadPatientReport
} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/user-activity", authenticate, verifySystemAdmin, fetchUserActivityReport);
router.get("/audit-trail", authenticate, verifySystemAdmin, fetchAuditTrail);
router.get("/clinic-performance", authenticate, verifySystemAdmin, fetchClinicPerformanceReport);
router.post("/patient", authenticate, verifyClinicAdmin, downloadPatientReport);

export default router;
