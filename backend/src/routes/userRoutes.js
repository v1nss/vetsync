import express from 'express';
import { register, createVetProfessional, updateUserDetails, fetchUserDataById, checkEmailExists } from '../controllers/userController.js';
import { authenticate, verifyClinicAdmin } from '../../global/middleware/authMiddleware.js';
import upload from '../../global/config/multer.js';

const router = express.Router();

// users Creation Routes
router.post('/register', upload.single("file"), register); // for petOwner or clinicAdmin
router.post('/vet', authenticate, verifyClinicAdmin, upload.single("file"), createVetProfessional); // only clinic admin

router.get('/:id', authenticate, fetchUserDataById);

// users Update Routes
router.put('/update/:id', authenticate, updateUserDetails); // any logged in user

router.put('/email-check', checkEmailExists);

export default router;