// main.js - Funciones generales para el sistema de gestión de bibliotecas

document.addEventListener('DOMContentLoaded', function() {
    // Navegación activa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });

    // Logout global
    const logoutBtn = document.querySelector('.nav-link[href="login.html"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('token');
            // Opcional: llamar al endpoint backend para referencia
            fetch('http://localhost:3001/api/admin/logout', { method: 'POST' });
            window.location.href = 'login.html';
        });
    }
});
