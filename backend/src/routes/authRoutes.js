import express from 'express';
import { login, logout, refreshToken, getMe } from '../controllers/authController.js';
import { authenticate, refreshAuthenticate } from '../../global/middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', refreshAuthenticate, getMe);

export default router;
