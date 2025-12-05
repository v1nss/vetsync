import express from 'express';
import { register, createVetProfessional, updateUserDetails, fetchUserDataById, checkEmailExists, fetchVetProfessionalsByClinic } from '../controllers/userController.js';
import { authenticate, verifyClinicAdmin } from '../../global/middleware/authMiddleware.js';
import upload from '../../global/config/multer.js';

const router = express.Router();

// users Creation Routes
router.post('/register', upload.single("file"), register); // for petOwner or clinicAdmin


router.get('/:id', authenticate, fetchUserDataById);

// users Update Routes
router.put('/update/:id', authenticate, updateUserDetails); // any logged in user

router.put('/email-check', checkEmailExists);

// Vet Professional
router.post('/vet', authenticate, verifyClinicAdmin, upload.single("file"), createVetProfessional); // only clinic admin
router.get('/my-clinic/vets', authenticate, verifyClinicAdmin, fetchVetProfessionalsByClinic)

export default router;