// Event listener para el formulario
document.getElementById('registroForm').addEventListener('submit', handleRegistro);

async function handleRegistro(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const telefono = document.getElementById('telefono').value;

    // Validaciones básicas
    if (password !== passwordConfirm) {
        showAlert('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    try {
        showAlert('Registrando usuario...', 'info');

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                email,
                password,
                telefono: telefono || null,
                role: 'student'
            })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('¡Registro exitoso! Redirigiendo al login...', 'success');

            // Redirigir al login después de 2s
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } else {
            showAlert(data.message || 'Error en el registro. Intenta con otro email.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión. Intenta más tarde.', 'error');
    }
}

console.log('✅ Registro.js cargado correctamente');
