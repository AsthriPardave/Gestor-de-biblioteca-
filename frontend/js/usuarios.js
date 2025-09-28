
// usuarios.js - CRUD conectado a backend API REST
const API_URL = 'http://localhost:3001/api/usuarios';
let usuarios = [];


function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return {};
    }
    return { 'Authorization': 'Bearer ' + token };
}

async function fetchUsuarios() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }
    usuarios = await res.json();
    renderUsuarios();
}

function renderUsuarios() {
    const tbody = document.querySelector('#tablaUsuarios tbody');
    tbody.innerHTML = '';
    usuarios.forEach((u, i) => {
        tbody.innerHTML += `<tr>
            <td>${u.nombre}</td>
            <td>${u.correo || ''}</td>
            <td>${u.rol || 'user'}</td>
            <td>
                <select class='form-select form-select-sm' onchange='cambiarEstadoUsuario(${u.id}, this.value)'>
                    <option value='prestado' ${u.estado === 'prestado' ? 'selected' : ''}>Prestado</option>
                    <option value='devuelto' ${u.estado === 'devuelto' ? 'selected' : ''}>Devuelto</option>
                    <option value='retraso' ${u.estado === 'retraso' ? 'selected' : ''}>Con retraso</option>
                </select>
            </td>
            <td><button class='btn btn-danger btn-sm' onclick='eliminarUsuario(${u.id})'>Eliminar</button></td>
        </tr>`;
    });
}


window.cambiarEstadoUsuario = async function(id, estado) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    usuario.estado = estado;
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    fetchUsuarios();
};


window.eliminarUsuario = async function(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    fetchUsuarios();
};

// Si tienes un formulario para crear usuarios, agrega aquí el submit con fetch POST

fetchUsuarios();
