const pool = require('../models/db');

const getLibros = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM libros');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLibro = async (req, res) => {
  try {
    const { titulo, autor, editorial, anio, stock } = req.body;
    const [result] = await pool.query(
      'INSERT INTO libros (titulo, autor, editorial, anio, stock, disponibles, prestados) VALUES (?, ?, ?, ?, ?, ?, 0)',
      [titulo, autor, editorial, anio, stock, stock]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, editorial, anio, stock, disponibles, prestados } = req.body;
    await pool.query(
      'UPDATE libros SET titulo=?, autor=?, editorial=?, anio=?, stock=?, disponibles=?, prestados=? WHERE id=?',
      [titulo, autor, editorial, anio, stock, disponibles, prestados, id]
    );
    res.json({ message: 'Libro actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLibro = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM libros WHERE id=?', [id]);
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLibros,
  createLibro,
  updateLibro,
  deleteLibro
};
