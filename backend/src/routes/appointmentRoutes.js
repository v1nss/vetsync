import express from 'express';
import { authenticate, verifyClinicAdmin } from '../../global/middleware/authMiddleware.js';
import { createNewAppointment, acceptAppointmentRequest, completeAppointmentRequest, getAppointmentsByOwner} from '../controllers/appointmentController.js';

const router = express.Router();

// endpoints not finalized yet
// Create new appointment - only pet owners
router.post('/create', authenticate, createNewAppointment);

router.get('/owner', authenticate, getAppointmentsByOwner);

router.patch('/accept/:appointmentId', authenticate, verifyClinicAdmin, acceptAppointmentRequest);

router.patch('/complete/:appointmentId', authenticate, completeAppointmentRequest);

export default router;