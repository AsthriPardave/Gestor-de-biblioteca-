
// libros.js - CRUD conectado a backend API REST
const API_URL = 'http://localhost:3001/api/libros';
let libros = [];


function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return {};
    }
    return { 'Authorization': 'Bearer ' + token };
}

async function fetchLibros() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }
    libros = await res.json();
    renderLibros();
}

function renderLibros() {
    const tbody = document.querySelector('#tablaLibros tbody');
    tbody.innerHTML = '';
    libros.forEach((l) => {
        tbody.innerHTML += `<tr>
            <td>${l.titulo}</td>
            <td>${l.autor}</td>
            <td>${l.anio || ''}</td>
            <td>${l.stock}</td>
            <td>${l.prestados || 0}</td>
            <td>${l.disponibles || (l.stock - (l.prestados || 0))}</td>
            <td><button class='btn btn-danger btn-sm' onclick='eliminarLibro(${l.id})'>Eliminar</button></td>
        </tr>`;
    });
}


window.eliminarLibro = async function(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    fetchLibros();
};


document.getElementById('libroForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const anio = document.getElementById('anio').value;
    const stock = parseInt(document.getElementById('stock').value);
    // Evitar duplicados por título y autor
    if (libros.some(l => l.titulo.toLowerCase() === titulo.toLowerCase() && l.autor.toLowerCase() === autor.toLowerCase())) {
        alert('Este libro ya está registrado.');
        return;
    }
    await fetch(API_URL, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, anio, stock })
    });
    fetchLibros();
    this.reset();
});

fetchLibros();
