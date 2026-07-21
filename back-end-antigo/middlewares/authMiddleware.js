// Middleware para verificar a autenticação

const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = (req, res, next) => {
    // Tentando pegar o token no header com Bearer
    const token = req.headers['authorization']?.split(' ')[1]; // Pega o token após 'Bearer'

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    // Verificando o token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido', error: err.message });
        }
        
        // Caso o token seja válido, adicionamos o id do usuário na requisição
        req.userId = decoded.id;
        
        // Prossegue para o próximo middleware ou rota
        next();
    });
};

module.exports = authMiddleware;
