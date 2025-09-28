const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamosController');

router.get('/', prestamosController.getPrestamos);
router.post('/', prestamosController.createPrestamo);
router.put('/devolver/:id', prestamosController.devolverPrestamo);

module.exports = router;
