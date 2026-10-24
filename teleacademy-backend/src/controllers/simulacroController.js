import { query } from '../config/database.js';

// Obtener todos los simulacros
export const getAllSimulacros = async (req, res) => {
    try {
        const result = await query('SELECT * FROM simulacros ORDER BY fecha_creacion DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error obteniendo simulacros' });
    }
};

// Obtener simulacro por ID
export const getSimulacroById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM simulacros WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Simulacro no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error obteniendo simulacro' });
    }
};

// Crear nuevo simulacro (solo admin)
export const createSimulacro = async (req, res) => {
    try {
        const { nombre, linkFormulario, imagen } = req.body;

        if (!nombre || !linkFormulario) {
            return res.status(400).json({ error: 'Nombre y link de formulario son requeridos' });
        }

        const result = await query(
            `INSERT INTO simulacros (nombre, linkFormulario, imagen)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nombre, linkFormulario, imagen || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error creando simulacro' });
    }
};

// Actualizar simulacro (solo admin)
export const updateSimulacro = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, linkFormulario, imagen } = req.body;

        const result = await query(
            `UPDATE simulacros
             SET nombre = COALESCE($1, nombre),
                 linkFormulario = COALESCE($2, linkFormulario),
                 imagen = COALESCE($3, imagen),
                 fecha_actualizacion = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING *`,
            [nombre, linkFormulario, imagen, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Simulacro no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error actualizando simulacro' });
    }
};

// Eliminar simulacro (solo admin)
export const deleteSimulacro = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM simulacros WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Simulacro no encontrado' });
        }

        res.json({ message: 'Simulacro eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error eliminando simulacro' });
    }
};
