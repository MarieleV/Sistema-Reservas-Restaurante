//Rotas de autenticação (login)
const express = require('express');
const router = express.Router();
const authController = require('../back-end-antigo/controllers/authController');

// Rota de login
router.post('/login', authController.login);

module.exports = router;
