const pool = require('../models/db');

const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { nombre, documento, telefono, correo, estado } = req.body;
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, documento, telefono, correo, estado) VALUES (?, ?, ?, ?, ?)',
      [nombre, documento, telefono, correo, estado || 'activo']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, documento, telefono, correo, estado } = req.body;
    await pool.query(
      'UPDATE usuarios SET nombre=?, documento=?, telefono=?, correo=?, estado=? WHERE id=?',
      [nombre, documento, telefono, correo, estado, id]
    );
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE id=?', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
