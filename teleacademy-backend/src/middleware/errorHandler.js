// Middleware para manejo de errores global
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Errores de base de datos
    if (err.code === '23505') {
        return res.status(400).json({
            error: 'Conflicto',
            message: 'Este registro ya existe (clave única violada)'
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            error: 'Referencia inválida',
            message: 'El registro referenciado no existe'
        });
    }

    // Errores de validación
    if (err.errors && Array.isArray(err.errors)) {
        return res.status(400).json({
            error: 'Validación fallida',
            details: err.errors.map(e => ({
                field: e.param,
                message: e.msg
            }))
        });
    }

    // Errores genéricos
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        error: err.error || 'Error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
