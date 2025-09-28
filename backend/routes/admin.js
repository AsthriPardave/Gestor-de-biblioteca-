const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.post('/login', adminController.login);
router.post('/logout', adminController.logout); // Referencia, logout es frontend

module.exports = router;
