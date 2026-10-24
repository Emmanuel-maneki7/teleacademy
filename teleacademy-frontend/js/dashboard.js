// Proteger la ruta - solo estudiantes
document.addEventListener('DOMContentLoaded', () => {
    if (!protectRoute('student')) return;

    // Cargar nombre del usuario
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.nombre || user.email;
    }

    // Cargar contenido
    loadQuienesSomos();
    loadProfesores();
    loadCursos();
    loadSimulacros();
    loadContacto();
});

// =============== CARGAR QUIÉNES SOMOS ===============
async function loadQuienesSomos() {
    try {
        const response = await authenticatedFetch('/content/quienes-somos');
        const data = await response.json();

        if (response.ok && data) {
            const content = `
                <p>${data.texto || 'Sin información disponible'}</p>
                ${data.imagen ? `<img src="${data.imagen}" alt="Quiénes Somos" style="max-width: 100%; height: auto; margin-top: 15px; border-radius: 8px;">` : ''}
            `;
            document.getElementById('quienesSomosContent').innerHTML = content;
        }
    } catch (error) {
        console.error('Error cargando Quiénes Somos:', error);
        document.getElementById('quienesSomosContent').innerHTML = '<p>Error al cargar información</p>';
    }
}

// =============== CARGAR PROFESORES ===============
async function loadProfesores() {
    try {
        const response = await authenticatedFetch('/profesores');
        const data = await response.json();

        if (response.ok && data.length > 0) {
            const html = data.map(profesor => `
                <div class="card" style="cursor: pointer;">
                    ${profesor.foto ? `<img src="${profesor.foto}" alt="${profesor.nombre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;">` : '<div style="width: 100%; height: 200px; background: #e0e0e0; border-radius: 6px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">Sin foto</div>'}
                    <h4 style="color: var(--primary); margin-bottom: 8px;">${profesor.nombre}</h4>
                    <p style="font-size: 13px; color: #666; margin-bottom: 10px;"><strong>Materia:</strong> ${profesor.materia}</p>
                    <p style="font-size: 13px; color: #666;">${profesor.descripcion}</p>
                </div>
            `).join('');
            document.getElementById('profesoresContent').innerHTML = html;
        } else {
            document.getElementById('profesoresContent').innerHTML = '<p>No hay profesores disponibles</p>';
        }
    } catch (error) {
        console.error('Error cargando profesores:', error);
        document.getElementById('profesoresContent').innerHTML = '<p>Error al cargar profesores</p>';
    }
}

// =============== CARGAR CURSOS ===============
async function loadCursos() {
    try {
        const response = await authenticatedFetch('/cursos');
        const data = await response.json();

        if (response.ok && data.length > 0) {
            const html = data.map(curso => `
                <div class="card" style="cursor: pointer;">
                    ${curso.imagen ? `<img src="${curso.imagen}" alt="${curso.nombre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;">` : '<div style="width: 100%; height: 200px; background: #e0e0e0; border-radius: 6px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">Sin imagen</div>'}
                    <h4 style="color: var(--primary); margin-bottom: 8px;">${curso.nombre}</h4>
                    <p style="font-size: 13px; color: #666;"><strong>Materia:</strong> ${curso.materia}</p>
                </div>
            `).join('');
            document.getElementById('cursosContent').innerHTML = html;
        } else {
            document.getElementById('cursosContent').innerHTML = '<p>No hay cursos disponibles</p>';
        }
    } catch (error) {
        console.error('Error cargando cursos:', error);
        document.getElementById('cursosContent').innerHTML = '<p>Error al cargar cursos</p>';
    }
}

// =============== CARGAR SIMULACROS ===============
async function loadSimulacros() {
    try {
        const response = await authenticatedFetch('/simulacros');
        const data = await response.json();

        if (response.ok && data.length > 0) {
            const html = data.map(simulacro => `
                <div class="card" style="cursor: pointer;">
                    ${simulacro.imagen ? `<img src="${simulacro.imagen}" alt="${simulacro.nombre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;">` : '<div style="width: 100%; height: 200px; background: #e0e0e0; border-radius: 6px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">Sin imagen</div>'}
                    <h4 style="color: var(--primary); margin-bottom: 8px;">${simulacro.nombre}</h4>
                    <a href="${simulacro.linkFormulario}" target="_blank" class="btn-primary" style="display: inline-block; margin-top: 10px;">Resolver Simulacro</a>
                </div>
            `).join('');
            document.getElementById('simulacrosContent').innerHTML = html;
        } else {
            document.getElementById('simulacrosContent').innerHTML = '<p>No hay simulacros disponibles</p>';
        }
    } catch (error) {
        console.error('Error cargando simulacros:', error);
        document.getElementById('simulacrosContent').innerHTML = '<p>Error al cargar simulacros</p>';
    }
}

// =============== CARGAR CONTACTO ===============
async function loadContacto() {
    try {
        const response = await authenticatedFetch('/content/contacto');
        const data = await response.json();

        if (response.ok && data) {
            const content = `
                <p>${data.texto || 'Sin información disponible'}</p>
                ${data.imagen ? `<img src="${data.imagen}" alt="Contacto" style="max-width: 100%; height: auto; margin-top: 15px; border-radius: 8px;">` : ''}
            `;
            document.getElementById('contactoContent').innerHTML = content;
        }
    } catch (error) {
        console.error('Error cargando Contacto:', error);
        document.getElementById('contactoContent').innerHTML = '<p>Error al cargar información de contacto</p>';
    }
}

// =============== FUNCIÓN AUXILIAR ===============
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

console.log('✅ Dashboard.js cargado correctamente');
