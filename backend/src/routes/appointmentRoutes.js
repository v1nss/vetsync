import express from 'express';
import { verifyToken, verifyClinicAdmin } from '../../global/middleware/authMiddleware.js';
import { createNewAppointment, acceptAppointmentRequest, completeAppointmentRequest } from '../controllers/appointmentController.js';

const router = express.Router();

// endpoints not finalized yet
// Create new appointment - only pet owners
router.post('/create', verifyToken, createNewAppointment);

router.patch('/accept/:appointmentId', verifyToken, verifyClinicAdmin, acceptAppointmentRequest);

router.patch('/complete/:appointmentId', verifyToken, completeAppointmentRequest);

export default router;