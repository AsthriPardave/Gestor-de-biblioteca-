CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(30) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    estado ENUM('activo','prestamo','retraso') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de libros
CREATE TABLE libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    editorial VARCHAR(100),
    anio INT,
    stock INT NOT NULL DEFAULT 1,
    disponibles INT NOT NULL DEFAULT 1,
    prestados INT NOT NULL DEFAULT 0,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de prestamos
CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion DATETIME,
    estado ENUM('prestado','devuelto','retraso') DEFAULT 'prestado',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (libro_id) REFERENCES libros(id)
);

-- Tabla de historial de prestamos
CREATE TABLE historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestamo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATETIME NOT NULL,
    fecha_devolucion DATETIME,
    estado ENUM('prestado','devuelto','retraso') NOT NULL,
    FOREIGN KEY (prestamo_id) REFERENCES prestamos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (libro_id) REFERENCES libros(id)
);

-- Usuario administrador (opcional, para login)
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);