import express from 'express';
import { createApprovalLog, getApprovalLogsByClinicId } from '../controllers/approvalLogsController.js';
import { authenticate } from '../../global/middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authenticate, createApprovalLog)

router.get("/clinic/:clinicId", authenticate, getApprovalLogsByClinicId);

export default router;