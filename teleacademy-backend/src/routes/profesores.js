import express from 'express';
import { getAllProfesores, getProfesorById, createProfesor, updateProfesor, deleteProfesor } from '../controllers/profesorController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllProfesores);
router.get('/:id', getProfesorById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createProfesor);
router.put('/:id', verifyToken, isAdmin, updateProfesor);
router.delete('/:id', verifyToken, isAdmin, deleteProfesor);

export default router;
