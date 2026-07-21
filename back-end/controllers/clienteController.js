const Usuario = require('../models/usuarioModel');
const Cliente = require('../models/clienteModel');

const clienteController = {
  criar: async (req, res, next) => {
    try {
      const { nome, email, telefone, cpf, senha } = req.body;

      // Verificar se todos os dados obrigatórios foram preenchidos
      if (!nome || !email || !telefone || !cpf || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      // Criar o usuário (não precisamos de token aqui)
      const idUsuario = await Usuario.criar({ nome, email, telefone, cpf, senha });

      // Criar o cliente com base no id do usuário
      const idCliente = await Cliente.criar(idUsuario);

      // Retornar a resposta de sucesso
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
