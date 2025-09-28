const pool = require('../models/db');

const getPrestamos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prestamos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPrestamo = async (req, res) => {
  try {
    const { usuario_id, libro_id, fecha_devolucion } = req.body;
    // Verificar disponibilidad
    const [[libro]] = await pool.query('SELECT disponibles FROM libros WHERE id=?', [libro_id]);
    if (!libro || libro.disponibles < 1) {
      return res.status(400).json({ error: 'No hay ejemplares disponibles' });
    }
    // Crear préstamo
    const [result] = await pool.query(
      'INSERT INTO prestamos (usuario_id, libro_id, fecha_devolucion) VALUES (?, ?, ?)',
      [usuario_id, libro_id, fecha_devolucion]
    );
    // Actualizar libro
    await pool.query('UPDATE libros SET disponibles = disponibles - 1, prestados = prestados + 1 WHERE id=?', [libro_id]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const devolverPrestamo = async (req, res) => {
  try {
    const { id } = req.params;
    // Obtener préstamo
    const [[prestamo]] = await pool.query('SELECT * FROM prestamos WHERE id=?', [id]);
    if (!prestamo || prestamo.estado !== 'prestado') {
      return res.status(400).json({ error: 'Préstamo no válido' });
    }
    // Actualizar préstamo
    await pool.query('UPDATE prestamos SET estado="devuelto", fecha_devolucion=NOW() WHERE id=?', [id]);
    // Actualizar libro
    await pool.query('UPDATE libros SET disponibles = disponibles + 1, prestados = prestados - 1 WHERE id=?', [prestamo.libro_id]);
    res.json({ message: 'Libro devuelto' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPrestamos,
  createPrestamo,
  devolverPrestamo
};
