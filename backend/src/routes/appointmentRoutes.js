import express from 'express';
import { verifyToken, verifyClinicAdmin } from '../middleware/authMiddleware.js';
import { createNewAppointment, acceptAppointmentRequest } from '../controllers/appointmentController.js';

const router = express.Router();

// Create new appointment - only pet owners
router.post('/create', verifyToken, createNewAppointment);

router.patch('/accept/:appointmentId', verifyToken, verifyClinicAdmin, acceptAppointmentRequest);

export default router;