# Teleacademy - Backend API

Backend REST API con Node.js + Express + PostgreSQL para la plataforma de academia preuniversitaria Teleacademy.

## 📋 Requisitos

- Node.js v18+
- PostgreSQL 12+
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/teleacademy-backend.git
cd teleacademy-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env` y configura tus variables:
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teleacademy
DB_USER=postgres
DB_PASSWORD=tu_contraseña
PORT=3001
JWT_SECRET=tu_secreto_jwt
```

### 4. Crear base de datos PostgreSQL
```bash
createdb teleacademy
```

### 5. Iniciar el servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3001`

## 📡 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/profile` - Obtener perfil (protegido)
- `GET /api/auth/verify-token` - Verificar token (protegido)

### Cursos
- `GET /api/cursos` - Listar todos los cursos
- `GET /api/cursos/:id` - Obtener un curso
- `POST /api/cursos` - Crear curso (admin)
- `PUT /api/cursos/:id` - Actualizar curso (admin)
- `DELETE /api/cursos/:id` - Eliminar curso (admin)

### Profesores
- `GET /api/profesores` - Listar todos los profesores
- `GET /api/profesores/:id` - Obtener un profesor
- `POST /api/profesores` - Crear profesor (admin)
- `PUT /api/profesores/:id` - Actualizar profesor (admin)
- `DELETE /api/profesores/:id` - Eliminar profesor (admin)

### Simulacros
- `GET /api/simulacros` - Listar todos los simulacros
- `GET /api/simulacros/:id` - Obtener un simulacro
- `POST /api/simulacros` - Crear simulacro (admin)
- `PUT /api/simulacros/:id` - Actualizar simulacro (admin)
- `DELETE /api/simulacros/:id` - Eliminar simulacro (admin)

### Contenido
- `GET /api/content/:tipo` - Obtener contenido (quienes-somos, contacto)
- `PUT /api/content/:tipo` - Actualizar contenido (admin)

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens). Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <token>
```

## 🗄️ Estructura de la Base de Datos

### usuarios
- id, nombre, email, password, telefono, rol, confirmado, fecha_creacion, fecha_actualizacion

### cursos
- id, nombre, materia, descripcion, imagen, fecha_creacion, fecha_actualizacion

### profesores
- id, nombre, materia, descripcion, foto, email, telefono, fecha_creacion, fecha_actualizacion

### simulacros
- id, nombre, linkFormulario, imagen, fecha_creacion, fecha_actualizacion

### contenido
- id, tipo, texto, imagen, fecha_actualizacion

## 🚢 Deployment en Render

1. Crear una cuenta en [Render.com](https://render.com)
2. Crear una nueva Web Service
3. Conectar con tu repositorio de GitHub
4. Configurar las variables de entorno en Render
5. Render desplegará automáticamente en cada push

## 📝 Ejemplo de Registro
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Perez",
    "email": "juan@email.com",
    "password": "contraseña123",
    "rol": "student"
  }'
```

## 📝 Ejemplo de Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "password": "contraseña123",
    "role": "student"
  }'
```

## 🐛 Troubleshooting

**Error: "connect ECONNREFUSED"** - PostgreSQL no está corriendo
```bash
# En Linux/Mac
sudo service postgresql start

# En Windows
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

**Error: "database does not exist"** - Crear la base de datos
```bash
createdb teleacademy
```

## 📚 Documentación

Para más información, revisa el archivo `.env` para configuraciones adicionales.

## 👨‍💻 Autor

Creado con ❤️ para Teleacademy

## 📄 Licencia

MIT
