import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

// Crear conexión a PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Eventos de conexión
pool.on('error', (err) => {
    console.error('Error no esperado en el pool de conexiones:', err);
});

// Función para ejecutar queries
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
};

// Función para obtener un cliente
export const getClient = async () => {
    const client = await pool.connect();
    return client;
};

// Inicializar base de datos (crear tablas si no existen)
export const initializeDatabase = async () => {
    try {
        console.log('🗄️  Inicializando base de datos...');

        // Tabla de usuarios (estudiantes y admins)
        await query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                telefono VARCHAR(20),
                rol VARCHAR(50) DEFAULT 'student',
                confirmado BOOLEAN DEFAULT false,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de cursos
        await query(`
            CREATE TABLE IF NOT EXISTS cursos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                materia VARCHAR(255) NOT NULL,
                descripcion TEXT,
                imagen VARCHAR(500),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de profesores
        await query(`
            CREATE TABLE IF NOT EXISTS profesores (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                materia VARCHAR(255) NOT NULL,
                descripcion TEXT,
                foto VARCHAR(500),
                email VARCHAR(255),
                telefono VARCHAR(20),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de simulacros
        await query(`
            CREATE TABLE IF NOT EXISTS simulacros (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                linkFormulario VARCHAR(500) NOT NULL,
                imagen VARCHAR(500),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de contenido (Quiénes Somos, Contacto, etc)
        await query(`
            CREATE TABLE IF NOT EXISTS contenido (
                id SERIAL PRIMARY KEY,
                tipo VARCHAR(100) NOT NULL UNIQUE,
                texto TEXT,
                imagen VARCHAR(500),
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de inscripciones (relación estudiantes-cursos)
        await query(`
            CREATE TABLE IF NOT EXISTS inscripciones (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
                estado VARCHAR(50) DEFAULT 'activo',
                progreso DECIMAL(5,2) DEFAULT 0,
                fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_completacion TIMESTAMP,
                UNIQUE(usuario_id, curso_id)
            );
        `);

        console.log('✅ Base de datos inicializada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        throw error;
    }
};

// Prueba de conexión
export const testConnection = async () => {
    try {
        const res = await query('SELECT NOW()');
        console.log('✅ Conexión a PostgreSQL exitosa:', res.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error);
        return false;
    }
};

export default pool;
