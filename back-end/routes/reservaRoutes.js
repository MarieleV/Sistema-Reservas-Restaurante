const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middlewares/authMiddleware'); // Adicione o middleware

// Criar nova reserva
router.post('/', authMiddleware, reservaController.criar); // Adicione o middleware se for necessário

// Listar todas as reservas
router.get('/', authMiddleware, reservaController.listarTodas); // Adicione o middleware se for necessário

// Atualizar reserva por ID
router.put('/:id', authMiddleware, reservaController.atualizar); // Adicione o middleware se for necessário

// Excluir reserva por ID
router.delete('/:id', authMiddleware, reservaController.excluir); // Adicione o middleware se for necessário

module.exports = router;
