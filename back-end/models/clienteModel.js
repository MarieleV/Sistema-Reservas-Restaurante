// models > clienteModel.js

const db = require('../config/db');

  const Cliente = {
    criar: async (idUsuario) => {
  const [result] = await db.execute(
  'INSERT INTO Cliente (id_Usuario) VALUES (?)',
  [idUsuario]
);
return result.insertId;
},

  listarTodos: async () => {
    const [rows] = await db.execute(`
    SELECT
    C.id,
    U.nome_Usuario,
    U.email_Usuario,
    U.cpf_Usuario,
    U.telefone_Usuario, -- <-- Adicionado: Campo de telefone
    COUNT(CASE WHEN R.status_Reserva = 'pendente' OR R.status_Reserva = 'confirmada' THEN R.id END) AS reservas_ativas -- <-- Adicionado: Contagem de reservas ativas
    FROM
    Cliente AS C
    INNER JOIN
    Usuario AS U ON C.id_Usuario = U.id
    LEFT JOIN -- Usamos LEFT JOIN para incluir clientes mesmo que não tenham reservas
    Reserva AS R ON C.id = R.Cliente_id
    GROUP BY
    C.id, U.nome_Usuario, U.email_Usuario, U.cpf_Usuario, U.telefone_Usuario
    ORDER BY
    U.nome_Usuario;
  `);
  return rows;
  },

  excluir: async (id) => {
  await db.execute('DELETE FROM Cliente WHERE id = ?', [id]);
  }
};

module.exports = Cliente;