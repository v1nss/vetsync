import express from 'express';
import { 
    authenticate, 
    verifyClinicAdmin, 
    verifyVetOrClinicAdmin 
} from '../../global/middleware/authMiddleware.js';

import { 
    createNewAppointment, 
    approveAppointmentRequest, 
    rejectAppointmentRequest,
    completeAppointmentRequest, 
    getAppointmentsByOwner, 
    deleteAppointmentById,
    fetchAppointmentsByClinic,
    getAppointmentsByVet
} from '../controllers/appointmentController.js';

const router = express.Router();

// endpoints not finalized yet
// Create new appointment - only pet owners
router.post('/create', authenticate, createNewAppointment);

router.get('/owner', authenticate, getAppointmentsByOwner);

router.get('/vet', authenticate, getAppointmentsByVet);

router.get('/clinic/:clinicId', authenticate, verifyVetOrClinicAdmin, fetchAppointmentsByClinic);

router.delete('/delete/:appointmentId', authenticate, deleteAppointmentById)

router.patch('/approve/:appointmentId', authenticate, verifyClinicAdmin, approveAppointmentRequest);

router.patch('/reject/:appointmentId', authenticate, verifyClinicAdmin, rejectAppointmentRequest);

router.patch('/complete/:appointmentId', authenticate, completeAppointmentRequest);

export default router;