import jwt from 'jsonwebtoken';

// Middleware para verificar JWT
export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'No autorizado',
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado',
                message: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión'
            });
        }

        return res.status(401).json({
            error: 'Token inválido',
            message: 'El token proporcionado no es válido'
        });
    }
};

// Middleware para verificar rol de admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.rol !== 'admin') {
        return res.status(403).json({
            error: 'Acceso prohibido',
            message: 'Solo los administradores pueden acceder a este recurso'
        });
    }
    next();
};

// Middleware para verificar rol de estudiante
export const isStudent = (req, res, next) => {
    if (!req.user || (req.user.rol !== 'student' && req.user.rol !== 'admin')) {
        return res.status(403).json({
            error: 'Acceso prohibido',
            message: 'Solo los estudiantes pueden acceder a este recurso'
        });
    }
    next();
};

// Generar JWT
export const generateToken = (userId, email, nombre, rol) => {
    return jwt.sign(
        {
            id: userId,
            email,
            nombre,
            rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};
