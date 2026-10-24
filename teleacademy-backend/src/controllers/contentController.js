import { query } from '../config/database.js';

// Obtener contenido por tipo
export const getContent = async (req, res) => {
    try {
        const { tipo } = req.params;

        const result = await query('SELECT * FROM contenido WHERE tipo = $1', [tipo]);

        if (result.rows.length === 0) {
            // Si no existe, retornar vacío
            return res.json({
                tipo,
                texto: '',
                imagen: ''
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error obteniendo contenido' });
    }
};

// Actualizar contenido (solo admin)
export const updateContent = async (req, res) => {
    try {
        const { tipo } = req.params;
        const { texto, imagen } = req.body;

        if (!tipo) {
            return res.status(400).json({ error: 'Tipo de contenido es requerido' });
        }

        // Verificar si existe
        const exists = await query('SELECT id FROM contenido WHERE tipo = $1', [tipo]);

        let result;

        if (exists.rows.length > 0) {
            // Actualizar
            result = await query(
                `UPDATE contenido
                 SET texto = COALESCE($1, texto),
                     imagen = COALESCE($2, imagen),
                     fecha_actualizacion = CURRENT_TIMESTAMP
                 WHERE tipo = $3
                 RETURNING *`,
                [texto || null, imagen || null, tipo]
            );
        } else {
            // Crear
            result = await query(
                `INSERT INTO contenido (tipo, texto, imagen)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [tipo, texto || null, imagen || null]
            );
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error actualizando contenido' });
    }
};
