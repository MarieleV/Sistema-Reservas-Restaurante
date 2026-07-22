const Usuario = require('../usuarios/usuarioModel');
const Cliente = require('./clienteModel');

const clienteController = {
  criar: async (req, res, next) => {
    try {
      const { nome, email, telefone, cpf, senha } = req.body;

      if (!nome || !email || !telefone || !cpf || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const idUsuario = await Usuario.criar({ nome, email, telefone, cpf, senha });
      const idCliente = await Cliente.criar(idUsuario);

      res.status(201).json({ idCliente, message: 'Cliente criado com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  listarTodos: async (req, res, next) => {
    try {
      const clientes = await Cliente.listarTodos();
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  },

  excluir: async (req, res, next) => {
    try {
      const { id } = req.params;
      await Cliente.excluir(id);
      res.json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = clienteController;