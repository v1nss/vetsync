import express from 'express';
import { login, generateRefreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

router.post('/refresh-token', generateRefreshToken);

export default router;
