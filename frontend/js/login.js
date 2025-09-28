
// login.js - Lógica de autenticación con backend
const API_LOGIN = 'http://localhost:3001/api/admin/login';

document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch(API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
    });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    } else {
        const data = await res.json();
        alert(data.error || 'Error de autenticación');
    }
});
