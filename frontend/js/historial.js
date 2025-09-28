
// historial.js - Visualización de historial de préstamos desde backend
const API_HISTORIAL = 'http://localhost:3001/api/historial';


function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return {};
    }
    return { 'Authorization': 'Bearer ' + token };
}

async function renderHistorial() {
    const tbody = document.querySelector('#tablaHistorial tbody');
    tbody.innerHTML = '';
    const res = await fetch(API_HISTORIAL, { headers: getAuthHeaders() });
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }
    const historial = await res.json();
    if (!historial.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay historial de préstamos.</td></tr>`;
        return;
    }
    historial.forEach((h) => {
        tbody.innerHTML += `<tr>
            <td>${h.usuario}</td>
            <td>${h.libro}</td>
            <td>${h.fecha_prestamo ? h.fecha_prestamo.slice(0,10) : ''}</td>
            <td>${h.fecha_devolucion ? h.fecha_devolucion.slice(0,10) : ''}</td>
            <td>${h.estado}</td>
        </tr>`;
    });
}

renderHistorial();
