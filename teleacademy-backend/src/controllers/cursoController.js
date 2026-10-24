import { query } from '../config/database.js';

// Obtener todos los cursos
export const getAllCursos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM cursos ORDER BY fecha_creacion DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error obteniendo cursos' });
    }
};

// Obtener un curso por ID
export const getCursoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM cursos WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error obteniendo curso' });
    }
};

// Crear nuevo curso (solo admin)
export const createCurso = async (req, res) => {
    try {
        const { nombre, materia, descripcion, imagen } = req.body;

        if (!nombre || !materia) {
            return res.status(400).json({ error: 'Nombre y materia son requeridos' });
        }

        const result = await query(
            `INSERT INTO cursos (nombre, materia, descripcion, imagen)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nombre, materia, descripcion || null, imagen || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error creando curso' });
    }
};

// Actualizar curso (solo admin)
export const updateCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, materia, descripcion, imagen } = req.body;

        const result = await query(
            `UPDATE cursos
             SET nombre = COALESCE($1, nombre),
                 materia = COALESCE($2, materia),
                 descripcion = COALESCE($3, descripcion),
                 imagen = COALESCE($4, imagen),
                 fecha_actualizacion = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [nombre, materia, descripcion, imagen, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error actualizando curso' });
    }
};

// Eliminar curso (solo admin)
export const deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM cursos WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        res.json({ message: 'Curso eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error eliminando curso' });
    }
};
