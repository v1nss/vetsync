import express from 'express';
import { authenticate, verifyClinicAdmin } from '../../global/middleware/authMiddleware.js';
import { 
    createNewAppointment, 
    approveAppointmentRequest, 
    completeAppointmentRequest, 
    getAppointmentsByOwner, 
    deleteAppointmentById,
    fetchAppointmentsByClinic
} from '../controllers/appointmentController.js';

const router = express.Router();

// endpoints not finalized yet
// Create new appointment - only pet owners
router.post('/create', authenticate, createNewAppointment);

router.get('/owner', authenticate, getAppointmentsByOwner);

router.get('/clinic/:clinicId', authenticate, verifyClinicAdmin, fetchAppointmentsByClinic);

router.delete('/delete/:appointmentId', authenticate, deleteAppointmentById)

router.patch('/approve/:appointmentId', authenticate, verifyClinicAdmin, approveAppointmentRequest);

router.patch('/complete/:appointmentId', authenticate, completeAppointmentRequest);

export default router;