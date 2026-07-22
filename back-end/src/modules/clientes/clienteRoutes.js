const express = require('express');
const router = express.Router();
const clienteController = require('./clienteController');
const authMiddleware = require('../../../middlewares/authMiddleware');

// Rota pública — Criar novo cliente (sem token)
router.post('/', clienteController.criar);

// Rotas protegidas — Exigem token
router.get('/', authMiddleware, clienteController.listarTodos);
router.delete('/:id', authMiddleware, clienteController.excluir);

module.exports = router;