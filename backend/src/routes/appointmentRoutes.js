import express from 'express';
import { verifyToken, verifyClinicAdmin } from '../middleware/authMiddleware.js';
import { createNewAppointment, acceptAppointmentRequest, completeAppointmentRequest } from '../controllers/appointmentController.js';

const router = express.Router();

// Create new appointment - only pet owners
router.post('/create', verifyToken, createNewAppointment);

router.patch('/accept/:appointmentId', verifyToken, verifyClinicAdmin, acceptAppointmentRequest);

router.patch('/complete/:appointmentId', verifyToken, completeAppointmentRequest);

export default router;