const db = require('../config/db');
const bcrypt = require('bcrypt');


// Criar novo usuário
exports.criarUsuario = async (req, res) => {
  const { nome_Usuario, cpf_Usuario, email_Usuario, telefone_Usuario, senha_Usuario } = req.body;
  if (!nome_Usuario || !cpf_Usuario || !email_Usuario || !senha_Usuario) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }
  
  try {
    // Verificar se já existe um usuário com o mesmo e-mail
    const [existingUser] = await db.execute('SELECT * FROM Usuario WHERE email_Usuario = ?', [email_Usuario]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'E-mail já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(senha_Usuario, 10);
    const [result] = await db.execute(
      `INSERT INTO Usuario (nome_Usuario, cpf_Usuario, email_Usuario, telefone_Usuario, senha_Usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [nome_Usuario, cpf_Usuario, email_Usuario, telefone_Usuario || null, hashedPassword]
    );
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', userId: result.insertId });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário', details: err.message });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, nome_Usuario, email_Usuario, cpf_Usuario, telefone_Usuario FROM Usuario'
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários', details: err.message });
  }
};

// Buscar usuário por ID
exports.buscarUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT id, nome_Usuario, email_Usuario, cpf_Usuario, telefone_Usuario FROM Usuario WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário', details: err.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome_Usuario, email_Usuario, telefone_Usuario, senha_Usuario } = req.body; // <-- Adicionado senha_Usuario aqui

  if (!nome_Usuario || !email_Usuario) {
    return res.status(400).json({ message: 'Nome e e-mail são obrigatórios para atualizar.' });
  }

  try {
    let hashedPassword = null;
    if (senha_Usuario) {
        hashedPassword = await bcrypt.hash(senha_Usuario, 10); // Criptografa a nova senha
    }

    // Prepara os campos a serem atualizados
    const campos = [];
    const valores = [];

    if (nome_Usuario !== undefined) {
        campos.push('nome_Usuario = ?');
        valores.push(nome_Usuario);
    }
    if (email_Usuario !== undefined) {
        campos.push('email_Usuario = ?');
        valores.push(email_Usuario);
    }
    if (telefone_Usuario !== undefined) {
        campos.push('telefone_Usuario = ?');
        valores.push(telefone_Usuario);
    }
    if (hashedPassword !== null) { // Se uma nova senha foi fornecida e criptografada
        campos.push('senha_Usuario = ?');
        valores.push(hashedPassword);
    }

    if (campos.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido fornecido para atualização.' });
    }

    valores.push(id); // Adiciona o ID no final para a cláusula WHERE

    const sql = `UPDATE Usuario SET ${campos.join(', ')} WHERE id = ?`;
const [result] = await db.execute(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
    }

res.json({ message: 'Usuário atualizado com sucesso' });
} catch (err) {
console.error('Erro ao atualizar usuário:', err);
res.status(500).json({ error: 'Erro ao atualizar usuário', details: err.message });
}
};

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM Usuario WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado para exclusão.' });
    }

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ error: 'Erro ao deletar usuário', details: err.message });
  }
};
