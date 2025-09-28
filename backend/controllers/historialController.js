const pool = require('../models/db');

const getHistorial = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT h.*, u.nombre as usuario, l.titulo as libro
      FROM historial h
      JOIN usuarios u ON h.usuario_id = u.id
      JOIN libros l ON h.libro_id = l.id
      ORDER BY h.fecha_prestamo DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHistorial
};
