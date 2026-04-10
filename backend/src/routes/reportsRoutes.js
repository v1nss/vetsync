import express from "express";
import { authenticate, verifyClinicAdmin, verifySystemAdmin, verifyVetOrClinicAdmin } from "../../global/middleware/authMiddleware.js";
import { 
    fetchUserActivityReport, 
    fetchAuditTrail, 
    fetchClinicPerformanceReport,
    downloadPatientReport,
    downloadClinicReport,
    downloadAuditTrail

} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/user-activity", authenticate, verifySystemAdmin, fetchUserActivityReport);
router.get("/audit-trail", authenticate, verifySystemAdmin, fetchAuditTrail);
router.get("/clinic-performance", authenticate, verifySystemAdmin, fetchClinicPerformanceReport);
router.post("/patient", authenticate, verifyVetOrClinicAdmin, downloadPatientReport);
router.post("/clinic/:clinicId", authenticate, verifyClinicAdmin, downloadClinicReport);
router.get("/audit-trail/download", authenticate, verifySystemAdmin, downloadAuditTrail);

export default router;
