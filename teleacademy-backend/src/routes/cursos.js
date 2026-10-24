import express from 'express';
import { getAllCursos, getCursoById, createCurso, updateCurso, deleteCurso } from '../controllers/cursoController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (estudiantes pueden ver)
router.get('/', getAllCursos);
router.get('/:id', getCursoById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createCurso);
router.put('/:id', verifyToken, isAdmin, updateCurso);
router.delete('/:id', verifyToken, isAdmin, deleteCurso);

export default router;
