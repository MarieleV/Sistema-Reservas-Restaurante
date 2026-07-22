const express = require('express');
const router = express.Router();
const reservaController = require('./reservaController');
const authMiddleware = require('../../../middlewares/authMiddleware');

// Criar nova reserva
router.post('/', authMiddleware, reservaController.criar);

// Listar todas as reservas
router.get('/', authMiddleware, reservaController.listarTodas);

// Atualizar reserva por ID
router.put('/:id', authMiddleware, reservaController.atualizar);

// Excluir reserva por ID
router.delete('/:id', authMiddleware, reservaController.excluir);

module.exports = router;