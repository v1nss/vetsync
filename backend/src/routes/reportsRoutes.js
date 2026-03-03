import express from "express";
import { authenticate, verifySystemAdmin } from "../../global/middleware/authMiddleware.js";
import { fetchUserActivityReport, fetchAuditTrail } from "../controllers/reportsController.js";
import { fetchClinicPerformanceReport } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/user-activity", authenticate, verifySystemAdmin, fetchUserActivityReport);
router.get("/audit-trail", authenticate, verifySystemAdmin, fetchAuditTrail);
router.get("/clinic-performance", authenticate, verifySystemAdmin, fetchClinicPerformanceReport);

export default router;
