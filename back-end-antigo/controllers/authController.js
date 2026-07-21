// backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const config = require('../config/config');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE email_Usuario = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email não encontrado' });
        }

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha_Usuario);

        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        // Gera o token JWT com o ID do usuário (usuario.id)
        const token = jwt.sign({ id: usuario.id }, config.jwtSecret, { expiresIn: '1h' });

        // Retorna o token E o ID do usuário no sucesso do login
        res.json({ message: 'Login realizado com sucesso', token, userId: usuario.id }); // <-- Mudança AQUI
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};