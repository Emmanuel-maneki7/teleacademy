import express from 'express';
import { getContent, updateContent } from '../controllers/contentController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/:tipo', getContent);

// Rutas protegidas (solo admin)
router.put('/:tipo', verifyToken, isAdmin, updateContent);

export default router;
