// Proteger la ruta - solo admin
document.addEventListener('DOMContentLoaded', () => {
    if (!protectRoute('admin')) return;

    // Cargar nombre del admin
    const user = getCurrentUser();
    if (user) {
        document.getElementById('adminName').textContent = user.nombre || user.email;
    }

    // Cargar datos iniciales
    loadQuienesSomosData();
    loadMateriasSelect();
    loadProfesoresTable();
    loadCursosTable();
    loadSimulacrosTable();
    loadContactoData();

    // Event listeners para formularios
    document.getElementById('quienesSomosForm').addEventListener('submit', saveQuienesSomos);
    document.getElementById('addProfesorForm').addEventListener('submit', addProfesor);
    document.getElementById('addCursoForm').addEventListener('submit', addCurso);
    document.getElementById('addSimulacroForm').addEventListener('submit', addSimulacro);
    document.getElementById('contactoForm').addEventListener('submit', saveContacto);
});

// =============== NAVEGACIÓN ENTRE SECCIONES ===============
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remover clase active de todos los links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });

    // Mostrar sección seleccionada
    document.getElementById(sectionId).classList.add('active');

    // Marcar link como activo
    event.target.classList.add('active');
}

// =============== QUIÉNES SOMOS ===============
async function loadQuienesSomosData() {
    try {
        const response = await authenticatedFetch('/content/quienes-somos');
        const data = await response.json();

        if (response.ok && data) {
            document.getElementById('quienesSomosText').value = data.texto || '';
            document.getElementById('quienesSomosImage').value = data.imagen || '';
        }
    } catch (error) {
        console.error('Error cargando Quiénes Somos:', error);
    }
}

async function saveQuienesSomos(e) {
    e.preventDefault();

    const data = {
        texto: document.getElementById('quienesSomosText').value,
        imagen: document.getElementById('quienesSomosImage').value
    };

    try {
        const response = await authenticatedFetch('/content/quienes-somos', {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert('Quiénes Somos actualizado correctamente', 'success');
        } else {
            showAlert('Error al guardar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// =============== PROFESORES ===============
async function loadMateriasSelect() {
    try {
        const response = await authenticatedFetch('/cursos');
        const cursos = await response.json();

        if (response.ok) {
            const materias = [...new Set(cursos.map(c => c.materia))];
            const select = document.getElementById('materiaProfesor');
            materias.forEach(materia => {
                const option = document.createElement('option');
                option.value = materia;
                option.textContent = materia;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando materias:', error);
    }
}

async function loadProfesoresTable() {
    try {
        const response = await authenticatedFetch('/profesores');
        const profesores = await response.json();

        if (response.ok && profesores.length > 0) {
            const html = profesores.map(prof => `
                <tr>
                    <td><img src="${prof.foto}" alt="${prof.nombre}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"></td>
                    <td>${prof.nombre}</td>
                    <td>${prof.materia}</td>
                    <td>${prof.descripcion.substring(0, 50)}...</td>
                    <td>
                        <button class="btn-edit" onclick="editProfesor(${prof.id})">Editar</button>
                        <button class="btn-delete" onclick="deleteProfesor(${prof.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
            document.getElementById('profesorTableBody').innerHTML = html;
        } else {
            document.getElementById('profesorTableBody').innerHTML = '<tr><td colspan="5" style="text-align: center;">Sin profesores</td></tr>';
        }
    } catch (error) {
        console.error('Error cargando profesores:', error);
    }
}

async function addProfesor(e) {
    e.preventDefault();

    const data = {
        nombre: document.getElementById('nombreProfesor').value,
        materia: document.getElementById('materiaProfesor').value,
        descripcion: document.getElementById('descripcionProfesor').value,
        foto: document.getElementById('fotoProfesor').value
    };

    try {
        const response = await authenticatedFetch('/profesores', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert('Profesor agregado correctamente', 'success');
            document.getElementById('addProfesorForm').reset();
            loadProfesoresTable();
        } else {
            showAlert('Error al agregar profesor', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

async function deleteProfesor(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return;

    try {
        const response = await authenticatedFetch(`/profesores/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Profesor eliminado correctamente', 'success');
            loadProfesoresTable();
        } else {
            showAlert('Error al eliminar profesor', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// =============== CURSOS ===============
async function loadCursosTable() {
    try {
        const response = await authenticatedFetch('/cursos');
        const cursos = await response.json();

        if (response.ok && cursos.length > 0) {
            const html = cursos.map(curso => `
                <tr>
                    <td><img src="${curso.imagen}" alt="${curso.nombre}" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;"></td>
                    <td>${curso.nombre}</td>
                    <td>${curso.materia}</td>
                    <td>
                        <button class="btn-edit" onclick="editCurso(${curso.id})">Editar</button>
                        <button class="btn-delete" onclick="deleteCurso(${curso.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
            document.getElementById('cursoTableBody').innerHTML = html;
        } else {
            document.getElementById('cursoTableBody').innerHTML = '<tr><td colspan="4" style="text-align: center;">Sin cursos</td></tr>';
        }
    } catch (error) {
        console.error('Error cargando cursos:', error);
    }
}

async function addCurso(e) {
    e.preventDefault();

    const data = {
        nombre: document.getElementById('nombreCurso').value,
        materia: document.getElementById('materiaCurso').value,
        imagen: document.getElementById('imagenCurso').value
    };

    try {
        const response = await authenticatedFetch('/cursos', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert('Curso agregado correctamente', 'success');
            document.getElementById('addCursoForm').reset();
            loadCursosTable();
        } else {
            showAlert('Error al agregar curso', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

async function deleteCurso(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este curso?')) return;

    try {
        const response = await authenticatedFetch(`/cursos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Curso eliminado correctamente', 'success');
            loadCursosTable();
        } else {
            showAlert('Error al eliminar curso', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// =============== SIMULACROS ===============
async function loadSimulacrosTable() {
    try {
        const response = await authenticatedFetch('/simulacros');
        const simulacros = await response.json();

        if (response.ok && simulacros.length > 0) {
            const html = simulacros.map(sim => `
                <tr>
                    <td><img src="${sim.imagen}" alt="${sim.nombre}" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;"></td>
                    <td>${sim.nombre}</td>
                    <td><a href="${sim.linkFormulario}" target="_blank">Ver Formulario</a></td>
                    <td>
                        <button class="btn-edit" onclick="editSimulacro(${sim.id})">Editar</button>
                        <button class="btn-delete" onclick="deleteSimulacro(${sim.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
            document.getElementById('simulacroTableBody').innerHTML = html;
        } else {
            document.getElementById('simulacroTableBody').innerHTML = '<tr><td colspan="4" style="text-align: center;">Sin simulacros</td></tr>';
        }
    } catch (error) {
        console.error('Error cargando simulacros:', error);
    }
}

async function addSimulacro(e) {
    e.preventDefault();

    const data = {
        nombre: document.getElementById('nombreSimulacro').value,
        linkFormulario: document.getElementById('linkFormulario').value,
        imagen: document.getElementById('imagenSimulacro').value
    };

    try {
        const response = await authenticatedFetch('/simulacros', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert('Simulacro agregado correctamente', 'success');
            document.getElementById('addSimulacroForm').reset();
            loadSimulacrosTable();
        } else {
            showAlert('Error al agregar simulacro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

async function deleteSimulacro(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este simulacro?')) return;

    try {
        const response = await authenticatedFetch(`/simulacros/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Simulacro eliminado correctamente', 'success');
            loadSimulacrosTable();
        } else {
            showAlert('Error al eliminar simulacro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

// =============== CONTACTO ===============
async function loadContactoData() {
    try {
        const response = await authenticatedFetch('/content/contacto');
        const data = await response.json();

        if (response.ok && data) {
            document.getElementById('contactoText').value = data.texto || '';
            document.getElementById('contactoImage').value = data.imagen || '';
        }
    } catch (error) {
        console.error('Error cargando Contacto:', error);
    }
}

async function saveContacto(e) {
    e.preventDefault();

    const data = {
        texto: document.getElementById('contactoText').value,
        imagen: document.getElementById('contactoImage').value
    };

    try {
        const response = await authenticatedFetch('/content/contacto', {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert('Contacto actualizado correctamente', 'success');
        } else {
            showAlert('Error al guardar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error de conexión', 'error');
    }
}

console.log('✅ Admin.js cargado correctamente');
