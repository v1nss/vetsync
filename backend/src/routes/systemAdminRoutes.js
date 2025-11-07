import express from 'express';
import { verifyToken, verifySystemAdmin } from '../middleware/authMiddleware.js';
import { registerAdmin, fetchAllUsers, fetchAllClinics, approveClinic  } from '../controllers/systemAdminController.js';

const router = express.Router();

router.post('/register', registerAdmin);

// Define clinic admin specific routes here
router.get('/users', verifyToken, verifySystemAdmin, fetchAllUsers);
router.get('/clinics', verifyToken, verifySystemAdmin, fetchAllClinics);

router.patch('/clinics/:clinicId/approve', verifyToken, verifySystemAdmin, approveClinic);
//need to add routes for pending clinics, approving/rejecting clinics, stats, etc.
export default router;