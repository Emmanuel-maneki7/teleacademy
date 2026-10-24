import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';

// REGISTRO de nuevo usuario
export const register = async (req, res) => {
    try {
        const { nombre, email, password, telefono, rol = 'student' } = req.body;

        // Validar campos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: 'Validación fallida',
                message: 'Nombre, email y contraseña son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                error: 'Usuario existente',
                message: 'El email ya está registrado'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const result = await query(
            `INSERT INTO usuarios (nombre, email, password, telefono, rol)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, nombre, email, rol`,
            [nombre, email, hashedPassword, telefono || null, rol]
        );

        const user = result.rows[0];
        const token = generateToken(user.id, user.email, user.nombre, user.rol);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error en el servidor',
            message: 'No se pudo completar el registro'
        });
    }
};

// LOGIN de usuario
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({
                error: 'Validación fallida',
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const result = await query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Email o contraseña incorrectos'
            });
        }

        const user = result.rows[0];

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Email o contraseña incorrectos'
            });
        }

        // Verificar rol si se especifica
        if (role && user.rol !== role) {
            return res.status(403).json({
                error: 'Rol inválido',
                message: `Este usuario no tiene el rol de ${role}`
            });
        }

        // Generar token
        const token = generateToken(user.id, user.email, user.nombre, user.rol);

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error en el servidor',
            message: 'No se pudo completar el login'
        });
    }
};

// Obtener perfil del usuario
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(
            'SELECT id, nombre, email, telefono, rol, confirmado FROM usuarios WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario no existe'
            });
        }

        res.json({
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            error: 'Error en el servidor',
            message: 'No se pudo obtener el perfil'
        });
    }
};

// Verificar token
export const verifyTokenEndpoint = async (req, res) => {
    try {
        res.json({
            valid: true,
            user: req.user
        });
    } catch (error) {
        res.status(401).json({
            valid: false,
            message: 'Token inválido'
        });
    }
};
