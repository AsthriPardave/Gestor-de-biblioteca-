
const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const [[admin]] = await pool.query('SELECT * FROM admin WHERE usuario=?', [usuario]);
    if (!admin) return res.status(401).json({ error: 'Usuario no encontrado' });
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
    // Generar token JWT
    const token = jwt.sign(
      { usuario: admin.usuario, id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };

// Logout: solo frontend, pero se puede documentar endpoint para referencia
const logout = async (req, res) => {
  // El logout real es borrar el token en el frontend.
  // Si se quisiera invalidar tokens, se requeriría una lista negra en backend.
  res.json({ message: 'Logout exitoso (borrar token en frontend)' });
};

module.exports = { login, logout };
