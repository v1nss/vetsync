import express from "express";
import { authenticate, verifySystemAdmin } from "../../global/middleware/authMiddleware.js";
import { fetchUserActivityReport, fetchAuditTrail } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/user-activity", authenticate, verifySystemAdmin, fetchUserActivityReport);
router.get("/audit-trail", authenticate, verifySystemAdmin, fetchAuditTrail);

export default router;
