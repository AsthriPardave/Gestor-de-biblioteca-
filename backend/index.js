require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


const usuariosRoutes = require('./routes/usuarios');
const librosRoutes = require('./routes/libros');
const prestamosRoutes = require('./routes/prestamos');
const historialRoutes = require('./routes/historial');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./authMiddleware');

app.use(cors());
app.use(express.json());


// Proteger todas las rutas excepto login
app.use('/api/usuarios', authMiddleware, usuariosRoutes);
app.use('/api/libros', authMiddleware, librosRoutes);
app.use('/api/prestamos', authMiddleware, prestamosRoutes);
app.use('/api/historial', authMiddleware, historialRoutes);
app.use('/api/admin', adminRoutes); // login no requiere token

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
