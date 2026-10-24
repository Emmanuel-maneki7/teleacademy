import { query } from '../config/database.js';

// Obtener todos los profesores
export const getAllProfesores = async (req, res) => {
    try {
        const result = await query('SELECT * FROM profesores ORDER BY fecha_creacion DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error obteniendo profesores' });
    }
};

// Obtener profesor por ID
export const getProfesorById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM profesores WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error obteniendo profesor' });
    }
};

// Crear nuevo profesor (solo admin)
export const createProfesor = async (req, res) => {
    try {
        const { nombre, materia, descripcion, foto, email, telefono } = req.body;

        if (!nombre || !materia) {
            return res.status(400).json({ error: 'Nombre y materia son requeridos' });
        }

        const result = await query(
            `INSERT INTO profesores (nombre, materia, descripcion, foto, email, telefono)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [nombre, materia, descripcion || null, foto || null, email || null, telefono || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error creando profesor' });
    }
};

// Actualizar profesor (solo admin)
export const updateProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, materia, descripcion, foto, email, telefono } = req.body;

        const result = await query(
            `UPDATE profesores
             SET nombre = COALESCE($1, nombre),
                 materia = COALESCE($2, materia),
                 descripcion = COALESCE($3, descripcion),
                 foto = COALESCE($4, foto),
                 email = COALESCE($5, email),
                 telefono = COALESCE($6, telefono),
                 fecha_actualizacion = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [nombre, materia, descripcion, foto, email, telefono, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error actualizando profesor' });
    }
};

// Eliminar profesor (solo admin)
export const deleteProfesor = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM profesores WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        res.json({ message: 'Profesor eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error eliminando profesor' });
    }
};
