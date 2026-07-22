const express = require('express');
const router = express.Router();
const usuarioController = require('./usuarioController');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.post('/', usuarioController.criarUsuario);
router.get('/', authMiddleware, usuarioController.listarUsuarios);
router.get('/:id', authMiddleware, usuarioController.buscarUsuarioPorId);
router.put('/:id', authMiddleware, usuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, usuarioController.deletarUsuario);

module.exports = router;