
// prestamos.js - CRUD conectado a backend API REST
const API_PRESTAMOS = 'http://localhost:3001/api/prestamos';
const API_USUARIOS = 'http://localhost:3001/api/usuarios';
const API_LIBROS = 'http://localhost:3001/api/libros';
let prestamos = [];
let usuarios = [];
let libros = [];


function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return {};
    }
    return { 'Authorization': 'Bearer ' + token };
}

async function fetchAll() {
    const [presRes, usuRes, libRes] = await Promise.all([
        fetch(API_PRESTAMOS, { headers: getAuthHeaders() }),
        fetch(API_USUARIOS, { headers: getAuthHeaders() }),
        fetch(API_LIBROS, { headers: getAuthHeaders() })
    ]);
    if ([presRes, usuRes, libRes].some(res => res.status === 401 || res.status === 403)) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }
    prestamos = await presRes.json();
    usuarios = await usuRes.json();
    libros = await libRes.json();
    renderPrestamos();
    renderUsuariosSelect();
    renderLibrosSelect();
}

function renderPrestamos() {
    const tbody = document.querySelector('#tablaPrestamos tbody');
    tbody.innerHTML = '';
    prestamos.forEach((p) => {
        if (p.estado === 'prestado') {
            const usuario = usuarios.find(u => u.id === p.usuario_id);
            const libro = libros.find(l => l.id === p.libro_id);
            tbody.innerHTML += `<tr>
                <td>${usuario ? usuario.nombre : ''}</td>
                <td>${libro ? libro.titulo : ''}</td>
                <td>${p.fecha_prestamo ? p.fecha_prestamo.slice(0,10) : ''}</td>
                <td>${p.fecha_devolucion ? p.fecha_devolucion.slice(0,10) : ''}</td>
                <td><button class='btn btn-danger btn-sm' onclick='devolverPrestamo(${p.id})'>Devolver</button></td>
            </tr>`;
        }
    });
}

function renderUsuariosSelect() {
    const select = document.getElementById('usuario');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar usuario</option>';
    usuarios.forEach((u) => {
        select.innerHTML += `<option value="${u.id}">${u.nombre}</option>`;
    });
    select.innerHTML += '<option value="nuevo">Nuevo usuario</option>';
}

function renderLibrosSelect() {
    const select = document.getElementById('libro');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar libro</option>';
    libros.forEach((l) => {
        select.innerHTML += `<option value="${l.id}">${l.titulo}</option>`;
    });
}

function libroDisponible(id) {
    const libro = libros.find(l => l.id == id);
    return libro && libro.disponibles > 0;
}

document.getElementById('usuario')?.addEventListener('change', function() {
    const extra = document.getElementById('datosUsuarioExtra');
    if (this.value === 'nuevo') {
        extra.style.display = '';
    } else {
        extra.style.display = 'none';
    }
});

document.getElementById('libro')?.addEventListener('change', function() {
    const id = this.value;
    const disp = document.getElementById('disponibilidadLibro');
    if (id) {
        disp.textContent = libroDisponible(id) ? 'Disponible' : 'No disponible';
        disp.className = libroDisponible(id) ? 'form-text text-success' : 'form-text text-danger';
    } else {
        disp.textContent = '';
        disp.className = 'form-text';
    }
});


window.devolverPrestamo = async function(id) {
    await fetch(`${API_PRESTAMOS}/devolver/${id}`, { method: 'PUT', headers: getAuthHeaders() });
    fetchAll();
};


document.getElementById('prestamoForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const usuarioId = document.getElementById('usuario').value;
    const libroId = document.getElementById('libro').value;
    const fechaDevolucion = document.getElementById('fechaDevolucion').value;

    // Validación de campos obligatorios
    if (!libroId) {
        alert('Debes seleccionar un libro.');
        return;
    }
    if (!fechaDevolucion) {
        alert('Debes ingresar la fecha de devolución.');
        return;
    }

    if (usuarioId === 'nuevo') {
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const documento = document.getElementById('dni').value.trim();
        const telefono = document.getElementById('celular').value.trim();
        // Validar campos de usuario
        if (!nombre) {
            alert('El nombre del usuario es obligatorio.');
            return;
        }
        if (!documento) {
            alert('El documento (DNI) del usuario es obligatorio.');
            return;
        }
        if (!telefono) {
            alert('El teléfono del usuario es obligatorio.');
            return;
        }
        // Concatenar nombre y apellido para el backend
        const usuarioNuevo = {
            nombre: apellido ? `${nombre} ${apellido}` : nombre,
            documento,
            telefono,
            correo: '',
            estado: 'prestamo'
        };
        // Crear usuario y luego crear préstamo
        const res = await fetch(API_USUARIOS, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioNuevo)
        });
        let data;
        try {
            data = await res.json();
        } catch (e) {
            alert('Error inesperado al crear el usuario.');
            return;
        }
        if (!res.ok || !data.id) {
            alert(data.error || 'No se pudo crear el usuario. Verifica los datos.');
            return;
        }
        const nuevoId = data.id;
        await fetch(API_PRESTAMOS, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: nuevoId, libro_id: libroId, fecha_devolucion: fechaDevolucion })
        });
    } else {
        if (!libroDisponible(libroId)) {
            alert('El libro seleccionado no está disponible.');
            return;
        }
        await fetch(API_PRESTAMOS, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, libro_id: libroId, fecha_devolucion: fechaDevolucion })
        });
    }
    fetchAll();
    this.reset();
    document.getElementById('datosUsuarioExtra').style.display = 'none';
    document.getElementById('disponibilidadLibro').textContent = '';
});

fetchAll();
