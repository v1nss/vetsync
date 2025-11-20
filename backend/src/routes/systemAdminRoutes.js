import express from 'express';
import { verifyToken, verifySystemAdmin } from '../global/middleware/authMiddleware.js';
import { registerAdmin, fetchAllUsers, fetchAllClinics, updateClinicStatusController  } from '../controllers/systemAdminController.js';

const router = express.Router();

router.post('/register', registerAdmin);

// Define clinic admin specific routes here
router.get('/users', verifyToken, verifySystemAdmin, fetchAllUsers);
router.get('/clinics', verifyToken, verifySystemAdmin, fetchAllClinics);

router.patch('/clinics/:clinicId/status', verifyToken, verifySystemAdmin, updateClinicStatusController);
//need to add routes for pending clinics, approving/rejecting clinics, stats, etc.
export default router;