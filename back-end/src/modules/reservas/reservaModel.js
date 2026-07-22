const db = require('../../../config/db');

const Reserva = {
  criar: async ({ numeropessoas, data, clienteId }) => {
    const [result] = await db.execute(
      'INSERT INTO Reserva (numeropessoas_Reserva, data_Reserva, Cliente_id) VALUES (?, ?, ?)',
      [numeropessoas, data, clienteId]
    );
    return result.insertId;
  },

  listarTodas: async () => {
    const [rows] = await db.execute(`
      SELECT r.id, r.numeropessoas_Reserva, r.data_Reserva, r.status_Reserva, u.nome_Usuario
      FROM Reserva r
      INNER JOIN Cliente c ON r.Cliente_id = c.id
      INNER JOIN Usuario u ON c.id_Usuario = u.id`
    );
    return rows;
  },

  atualizar: async (id, dadosParaAtualizar) => {
    const campos = [];
    const valores = [];

    if (dadosParaAtualizar.numeropessoas !== undefined) {
      campos.push('numeropessoas_Reserva = ?');
      valores.push(dadosParaAtualizar.numeropessoas);
    }
    if (dadosParaAtualizar.data !== undefined) {
      campos.push('data_Reserva = ?');
      valores.push(dadosParaAtualizar.data);
    }
    if (dadosParaAtualizar.status !== undefined) {
      campos.push('status_Reserva = ?');
      valores.push(dadosParaAtualizar.status);
    }

    if (campos.length === 0) {
      throw new Error('Nenhum dado fornecido para atualização.');
    }

    valores.push(id); 

    const sql = `UPDATE Reserva SET ${campos.join(', ')} WHERE id = ?`;
    await db.execute(sql, valores);
  },

  excluir: async (id) => {
    await db.execute('DELETE FROM Reserva WHERE id = ?', [id]);
  }
};

module.exports = Reserva;