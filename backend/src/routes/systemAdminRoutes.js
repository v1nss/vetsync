import express from 'express';
import { authenticate, verifySystemAdmin } from '../../global/middleware/authMiddleware.js';
import { registerAdmin, fetchAllUsers, fetchAllClinics, updateClinicStatusController  } from '../controllers/systemAdminController.js';

const router = express.Router();

router.post('/register', registerAdmin);

// Define clinic admin specific routes here
router.get('/users', authenticate, verifySystemAdmin, fetchAllUsers);
router.get('/clinics', authenticate, verifySystemAdmin, fetchAllClinics);

router.patch('/clinics/:clinicId/status', authenticate, verifySystemAdmin, updateClinicStatusController);
//need to add routes for pending clinics, approving/rejecting clinics, stats, etc.
export default router;