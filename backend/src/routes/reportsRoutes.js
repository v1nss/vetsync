import express from "express";
import { authenticate, verifyClinicAdmin, verifySystemAdmin } from "../../global/middleware/authMiddleware.js";
import { 
    fetchUserActivityReport, 
    fetchAuditTrail, 
    fetchClinicPerformanceReport,
    downloadPatientReport,
    downloadClinicReport
} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/user-activity", authenticate, verifySystemAdmin, fetchUserActivityReport);
router.get("/audit-trail", authenticate, verifySystemAdmin, fetchAuditTrail);
router.get("/clinic-performance", authenticate, verifySystemAdmin, fetchClinicPerformanceReport);
router.post("/patient", authenticate, verifyClinicAdmin, downloadPatientReport);
router.post("/clinic", authenticate, verifySystemAdmin, downloadClinicReport);

export default router;
