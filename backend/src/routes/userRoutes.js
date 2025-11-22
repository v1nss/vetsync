import express from 'express';
import { register, createVetProfessional, updateUserDetails, fetchUserDataById, checkEmailExists } from '../controllers/userController.js';
import { verifyToken, verifyClinicAdmin } from '../../global/middleware/authMiddleware.js';
import upload from '../../global/config/multer.js';

const router = express.Router();

// users Creation Routes
router.post('/register', upload.single("file"), register); // for petOwner or clinicAdmin
router.post('/vet', verifyToken, verifyClinicAdmin, createVetProfessional); // only clinic admin

router.get('/:id', verifyToken, fetchUserDataById);

// users Update Routes
router.put('/update/:id', verifyToken, updateUserDetails); // any logged in user

router.put('/email-check', checkEmailExists);

export default router;