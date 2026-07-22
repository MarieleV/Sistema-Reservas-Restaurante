const Reserva = require('./reservaModel');
const pool = require('../../../config/db');

const HORARIO_ABERTURA = 10; 
const HORARIO_FECHAMENTO = 22; 

const reservaController = {
  criar: async (req, res, next) => {
    try {
        const userId = req.userId;

        const [clienteRows] = await pool.query('SELECT id FROM Cliente WHERE id_Usuario = ?', [userId]);

        if (clienteRows.length === 0) {
            return res.status(403).json({ message: 'Permissão negada: O usuário logado não está registrado como cliente.' });
        }

        const clienteId = clienteRows[0].id; 
        const { numeropessoas, data } = req.body; 

        if (!numeropessoas || !data || parseInt(numeropessoas) <= 0) {
            return res.status(400).json({ message: 'Número de pessoas e data/hora da reserva são obrigatórios.' });
        }

        const dataReservaObj = new Date(data); 

        if (isNaN(dataReservaObj.getTime())) {
            return res.status(400).json({ message: 'Formato de data e hora da reserva inválido.' });
        }

        const agora = new Date();
        agora.setSeconds(0, 0);
        dataReservaObj.setSeconds(0, 0);

        if (dataReservaObj < agora) {
            return res.status(400).json({ message: 'Não é possível fazer reservas para o passado.' });
        }

        const horaReserva = dataReservaObj.getHours(); 

        if (horaReserva < HORARIO_ABERTURA || horaReserva >= HORARIO_FECHAMENTO) {
            return res.status(400).json({ message: `Reservas permitidas apenas entre ${HORARIO_ABERTURA}:00 e ${HORARIO_FECHAMENTO}:00.` });
        }

        const [existingReserva] = await pool.query(
            `SELECT id FROM Reserva
            WHERE Cliente_id = ?
            AND data_Reserva = ?
            AND (status_Reserva = 'pendente' OR status_Reserva = 'confirmada')`,
            [clienteId, data] 
        );

        if (existingReserva.length > 0) {
            return res.status(409).json({ message: 'Você já possui uma reserva ativa para esta data e hora.' });
        }

        const idReserva = await Reserva.criar({ numeropessoas, data, clienteId });
        res.status(201).json({ idReserva, message: 'Reserva criada com sucesso!' });

    } catch (error) {
      console.error('Erro ao criar reserva:', error); 
      next(error); 
    }
  },

  listarTodas: async (req, res, next) => {
    try {
      const reservas = await Reserva.listarTodas();
      res.json(reservas);
    } catch (error) {
      console.error('Erro ao listar reservas:', error); 
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
      console.error('Erro ao excluir reserva:', error); 
      next(error);
    }
  }
};

module.exports = reservaController;