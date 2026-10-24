// API Base URL - cambiar según el entorno
const API_URL = 'http://localhost:3001/api'; // Desarrollo local
// const API_URL = 'https://tu-api.render.com/api'; // Producción

// =============== ELEMENTOS DEL DOM ===============
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const studentLoginForm = document.getElementById('studentLoginForm');
const adminLoginForm = document.getElementById('adminLoginForm');

// =============== EVENT LISTENERS ===============
if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });
}

if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', handleStudentLogin);
}

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
}

// =============== FUNCIONES DE TABS ===============
function handleTabClick(e) {
    const tabName = e.target.getAttribute('data-tab');

    // Remover clase active de todos los botones y contenidos
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Agregar clase active al botón y contenido seleccionado
    e.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// =============== LOGIN ESTUDIANTE ===============
async function handleStudentLogin(e) {
    e.preventDefault();

    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;

    try {
        showAlert('Verificando credenciales...', 'info');

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                role: 'student'
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('role', 'student');

            showAlert('¡Login exitoso! Redirigiendo...', 'success');

            // Redirigir al dashboard después de 1.5s
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1500);
        } else {
            showAlert(data.message || 'Email o contraseña incorrectos', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión. Intenta más tarde.', 'error');
    }

    // Limpiar formulario
    studentLoginForm.reset();
}

// =============== LOGIN ADMIN ===============
async function handleAdminLogin(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
        showAlert('Verificando credenciales de administrador...', 'info');

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                role: 'admin'
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('role', 'admin');

            showAlert('¡Login admin exitoso! Redirigiendo...', 'success');

            // Redirigir al panel admin después de 1.5s
            setTimeout(() => {
                window.location.href = 'pages/admin-panel.html';
            }, 1500);
        } else {
            showAlert(data.message || 'Credenciales inválidas', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión. Intenta más tarde.', 'error');
    }

    // Limpiar formulario
    adminLoginForm.reset();
}

// =============== FUNCIONES AUXILIARES ===============

// Mostrar alertas
function showAlert(message, type = 'info') {
    // Remover alertas anteriores
    const oldAlerts = document.querySelectorAll('.alert');
    oldAlerts.forEach(alert => alert.remove());

    // Crear nueva alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    // Insertar al principio del body
    document.body.insertBefore(alertDiv, document.body.firstChild);

    // Remover después de 4 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return localStorage.getItem('token') && localStorage.getItem('user');
}

// Obtener datos del usuario actual
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Obtener rol del usuario
function getUserRole() {
    return localStorage.getItem('role');
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/index.html';
}

// Hacer request autenticado (con token)
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Token inválido o expirado
        logout();
        return;
    }

    return response;
}

// Proteger rutas - redirigir si no está autenticado
function protectRoute(requiredRole = null) {
    if (!isAuthenticated()) {
        window.location.href = '/index.html';
        return false;
    }

    if (requiredRole && getUserRole() !== requiredRole) {
        window.location.href = '/index.html';
        return false;
    }

    return true;
}

console.log('✅ App.js cargado correctamente');
