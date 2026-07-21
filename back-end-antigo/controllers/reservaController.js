// backend/controllers/reservaController.js

const Reserva = require('../models/reservaModel');
const pool = require('../config/db');

// --- Horário de funcionamento do restaurante (constantes) ---
// Você pode considerar mover isso para 'backend/config/config.js' futuramente
const HORARIO_ABERTURA = 10; // 10:00 AM
const HORARIO_FECHAMENTO = 22; // 10:00 PM (significa que reservas são aceitas ATÉ 21:59:59)

const reservaController = {
  criar: async (req, res, next) => {
    try {
        const userId = req.userId; // ID do usuário logado, vem do authMiddleware

        // 1. Verificar se o usuário logado é um cliente cadastrado e obter o Cliente_id
        const [clienteRows] = await pool.query('SELECT id FROM Cliente WHERE id_Usuario = ?', [userId]);

        if (clienteRows.length === 0) {
            return res.status(403).json({ message: 'Permissão negada: O usuário logado não está registrado como cliente para fazer reservas.' });
        }

        const clienteId = clienteRows[0].id; // Obtém o ID da tabela Cliente para a FK
        const { numeropessoas, data } = req.body; // 'data' é a string DATETIME 'YYYY-MM-DD HH:MM:SS'

        // 2. Validação de campos obrigatórios e número de pessoas
        if (!numeropessoas || !data || parseInt(numeropessoas) <= 0) {
            return res.status(400).json({ message: 'Número de pessoas e data/hora da reserva são obrigatórios e válidos.' });
        }

        // --- INÍCIO DA IMPLEMENTAÇÃO RNF005: Validação de Horário de Funcionamento e Data no Passado ---
        const dataReservaObj = new Date(data); // Converte a string DATETIME para objeto Date

        // Verificar se a data é um objeto Date válido
        if (isNaN(dataReservaObj.getTime())) {
            return res.status(400).json({ message: 'Formato de data e hora da reserva inválido.' });
        }

        // 1. Validar se a data/hora da reserva não é no passado
        const agora = new Date();
        // Para comparação precisa, zera segundos e milissegundos de 'agora'.
        // Isso evita que uma reserva para '20:00:01' agora seja considerada no passado se o 'agora' for '20:00:00'.
        agora.setSeconds(0, 0);
        // Também zera segundos e milissegundos do objeto de reserva para alinhar a precisão.
        dataReservaObj.setSeconds(0, 0);

        if (dataReservaObj < agora) {
            return res.status(400).json({ message: 'Não é possível fazer reservas para o passado.' });
        }

        // 2. Validar o horário de funcionamento
        const horaReserva = dataReservaObj.getHours(); // Obtém a hora da reserva (0-23)

        if (horaReserva < HORARIO_ABERTURA || horaReserva >= HORARIO_FECHAMENTO) {
            return res.status(400).json({ message: `Reservas são permitidas apenas entre ${HORARIO_ABERTURA}:00 e ${HORARIO_FECHAMENTO}:00.` });
        }
        // --- FIM DA IMPLEMENTAÇÃO RNF005 ---

        // --- INÍCIO DA IMPLEMENTAÇÃO RNF010: Impedir Reservas Duplicadas ---
        // Verificar se já existe uma reserva ativa (pendente ou confirmada) para o mesmo cliente na mesma data/hora
        const [existingReserva] = await pool.query(
            `SELECT id FROM Reserva
            WHERE Cliente_id = ?
            AND data_Reserva = ?
            AND (status_Reserva = 'pendente' OR status_Reserva = 'confirmada')`,
            [clienteId, data] // 'data' já é a string DATETIME formatada para o SQL
        );

        if (existingReserva.length > 0) {
            return res.status(409).json({ message: 'Você já possui uma reserva ativa para esta data e hora.' });
        }
        // --- FIM DA IMPLEMENTAÇÃO RNF010 ---

        // 3. Criar a reserva no banco de dados
        const idReserva = await Reserva.criar({ numeropessoas, data, clienteId });
        res.status(201).json({ idReserva, message: 'Reserva criada com sucesso!' });

    } catch (error) {
      console.error('Erro ao criar reserva:', error); // Logar o erro completo para depuração no servidor
      next(error); // Passa o erro para o middleware de tratamento de erros global
    }
  },

  listarTodas: async (req, res, next) => {
    try {
      const reservas = await Reserva.listarTodas();
      res.json(reservas);
    } catch (error) {
      console.error('Erro ao listar reservas:', error); // Adicionado log para listarTodas
      next(error);
    }
  },

  atualizar: async (req, res, next) => {
    try {
      const { id } = req.params;
      const dadosParaAtualizar = req.body;

      await Reserva.atualizar(id, dadosParaAtualizar);
      res.json({ message: 'Reserva atualizada com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      next(error);
    }
  },

  excluir: async (req, res, next) => {
    try {
      const { id } = req.params;
      await Reserva.excluir(id);
      res.json({ message: 'Reserva excluída com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir reserva:', error); // Adicionado log para excluir
      next(error);
    }
  }
};

module.exports = reservaController;