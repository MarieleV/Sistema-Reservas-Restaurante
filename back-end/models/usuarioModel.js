// Model de usuários (interação com o banco)

const db = require('../config/db');
const bcrypt = require('bcrypt'); // <-- Linha adicionada: Importa a biblioteca bcrypt

const Usuario = {
    criar: async ({ nome, cpf, telefone, email, senha }) => {
        // Criptografar a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(senha, 10); // O '10' é o 'saltRounds', que determina a complexidade da criptografia. Um valor entre 10 e 12 é geralmente recomendado.

        const [result] = await db.execute(
            'INSERT INTO Usuario (nome_Usuario, cpf_Usuario, telefone_Usuario, email_Usuario, senha_Usuario) VALUES (?, ?, ?, ?, ?)',
            [nome, cpf, telefone, email, hashedPassword] // <-- Alterado: Usamos a senha criptografada aqui
        );
        return result.insertId;
    },

    listarTodos: async () => {
        const [rows] = await db.execute('SELECT id, nome_Usuario, email_Usuario, cpf_Usuario, telefone_Usuario FROM Usuario');
        return rows;
    },

    atualizar: async (id, { nome, email, telefone }) => {
        await db.execute(
            'UPDATE Usuario SET nome_Usuario = ?, email_Usuario = ?, telefone_Usuario = ? WHERE id = ?',
            [nome, email, telefone, id]
        );
    },

    excluir: async (id) => {
        await db.execute('DELETE FROM Usuario WHERE id = ?', [id]);
    }
};

module.exports = Usuario;