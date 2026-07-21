//Rotas de usuários (registro, login)
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota pública para criar um novo usuário
router.post('/', usuarioController.criarUsuario);

// Rotas protegidas (exemplos de futuras implementações)
router.get('/', authMiddleware, usuarioController.listarUsuarios);
router.get('/:id', authMiddleware, usuarioController.buscarUsuarioPorId);
router.put('/:id', authMiddleware, usuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, usuarioController.deletarUsuario);

module.exports = router;
