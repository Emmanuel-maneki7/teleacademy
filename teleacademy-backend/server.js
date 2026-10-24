import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './src/routes/auth.js';
import cursoRoutes from './src/routes/cursos.js';
import profesorRoutes from './src/routes/profesores.js';
import simulacroRoutes from './src/routes/simulacros.js';
import contentRoutes from './src/routes/content.js';

// Importar middleware
import { errorHandler } from './src/middleware/errorHandler.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =============== MIDDLEWARE ===============

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============== RUTAS ===============

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/simulacros', simulacroRoutes);
app.use('/api/content', contentRoutes);

// =============== ERROR HANDLING ===============

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        error: 'No encontrado',
        message: `La ruta ${req.method} ${req.path} no existe`,
        status: 404
    });
});

// Global error handler
app.use(errorHandler);

// =============== INICIAR SERVIDOR ===============

app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📡 http://localhost:${PORT}`);
    console.log(`💚 Teleacademy Backend - ${process.env.NODE_ENV}`);
});

export default app;
