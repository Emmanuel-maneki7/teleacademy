# Teleacademy - Frontend

Frontend HTML + CSS + JavaScript vanilla para la plataforma de academia preuniversitaria Teleacademy.

## 📁 Estructura del Proyecto

```
teleacademy-frontend/
├── index.html                 # Página de login principal
├── css/
│   └── styles.css            # Estilos globales
├── js/
│   ├── app.js                # Lógica principal y autenticación
│   ├── dashboard.js          # Lógica del panel de estudiante
│   ├── admin.js              # Lógica del panel de administrador
│   └── registro.js           # Lógica del registro de estudiantes
├── pages/
│   ├── dashboard.html        # Panel para estudiantes
│   ├── admin-panel.html      # Panel para administradores
│   └── registro.html         # Página de registro
├── public/                   # Imágenes y assets
└── README.md                 # Este archivo
```

## 🚀 Cómo Usar

### Requisitos
- Un servidor web (Vercel, Netlify, etc.)
- Backend API en funcionamiento (Render + Node.js + Express)

### Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/tuusuario/teleacademy-frontend.git
cd teleacademy-frontend
```

2. Abre `index.html` en tu navegador o sirve los archivos con un servidor local:
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx http-server
```

3. Abre `http://localhost:8000` en tu navegador

### Configuración de API

En el archivo `js/app.js`, cambia la URL de la API según el entorno:

```javascript
// Desarrollo local
const API_URL = 'http://localhost:3001/api';

// Producción (Render)
const API_URL = 'https://tu-api.render.com/api';
```

## 📄 Archivos Principales

### index.html
Página de login con dos pestañas:
- **Estudiante**: Login para alumnos registrados
- **Administrador**: Login para administradores

### pages/dashboard.html
Panel de estudiante con secciones:
- Quiénes Somos
- Profesores
- Cursos
- Simulacros
- Contacto

### pages/admin-panel.html
Panel administrativo con CRUD para:
- Quiénes Somos (texto + imagen)
- Profesores (nombre, materia, descripción, foto)
- Cursos (nombre, materia, imagen)
- Simulacros (nombre, link formulario, imagen)
- Contacto (texto + imagen)

### js/app.js
- Funciones de autenticación (login, logout)
- Manejo de tokens JWT
- Requests autenticadas a la API
- Protección de rutas

### js/dashboard.js
- Carga de datos para estudiantes
- Renderizado dinámico de contenido
- Navegación entre secciones

### js/admin.js
- Funciones CRUD para todas las secciones
- Carga dinámica de datos
- Validación de formularios

## 🎨 Diseño

El proyecto utiliza:
- **Colores**: Vino (#8B2E3B) como color principal
- **Tipografía**: Segoe UI, sans-serif
- **Layout**: Responsive para móvil, tablet y desktop
- **Animaciones**: Transiciones suaves CSS

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens):
1. Usuario inicia sesión
2. Backend retorna un token
3. Token se guarda en `localStorage`
4. Token se envía en el header `Authorization` para requests autenticados
5. Si el token expira, se redirige al login

## 📡 API Endpoints Esperados

```
POST   /auth/register              # Registro de estudiante
POST   /auth/login                 # Login (estudiante/admin)
GET    /content/quienes-somos      # Obtener info "Quiénes Somos"
PUT    /content/quienes-somos      # Actualizar "Quiénes Somos"
GET    /content/contacto           # Obtener info "Contacto"
PUT    /content/contacto           # Actualizar "Contacto"
GET    /profesores                 # Listar profesores
POST   /profesores                 # Crear profesor
DELETE /profesores/:id             # Eliminar profesor
GET    /cursos                     # Listar cursos
POST   /cursos                     # Crear curso
DELETE /cursos/:id                 # Eliminar curso
GET    /simulacros                 # Listar simulacros
POST   /simulacros                 # Crear simulacro
DELETE /simulacros/:id             # Eliminar simulacro
```

## 🚢 Deployment

### Vercel
1. Conecta tu repositorio GitHub a Vercel
2. Vercel automáticamente detectará y hará build
3. Actualiza la URL de API en producción

### Netlify
1. Conecta tu repositorio a Netlify
2. En "Build settings", deja en blanco (no necesita build)
3. Deploy automático en cada push

## 📝 Variables de Entorno

Aunque este es un frontend puro, en futuro puedes usar un archivo `.env`:
```
VITE_API_URL=https://tu-api.render.com/api
```

## 🐛 Troubleshooting

**Error CORS**: Asegúrate que el backend tiene CORS habilitado:
```javascript
app.use(cors());
```

**Token inválido**: Limpia localStorage y vuelve a hacer login:
```javascript
localStorage.clear();
```

**Las imágenes no cargan**: Verifica que los URLs de las imágenes sean públicos y accesibles.

## 📚 Documentación Adicional

- [HTML5 Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 👨‍💻 Autor

Creado con ❤️ para Teleacademy

## 📄 Licencia

Este proyecto está bajo licencia MIT.
