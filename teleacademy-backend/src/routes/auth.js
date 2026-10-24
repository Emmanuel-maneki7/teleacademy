import express from 'express';
import { register, login, getProfile, verifyTokenEndpoint } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/profile', verifyToken, getProfile);
router.get('/verify-token', verifyToken, verifyTokenEndpoint);

export default router;
