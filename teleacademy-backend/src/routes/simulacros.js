import express from 'express';
import { getAllSimulacros, getSimulacroById, createSimulacro, updateSimulacro, deleteSimulacro } from '../controllers/simulacroController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllSimulacros);
router.get('/:id', getSimulacroById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createSimulacro);
router.put('/:id', verifyToken, isAdmin, updateSimulacro);
router.delete('/:id', verifyToken, isAdmin, deleteSimulacro);

export default router;
