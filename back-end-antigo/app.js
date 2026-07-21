// Configuração do Express e integração com as rotas
require('dotenv').config();

// app.js
const express = require('express');
const app = express();
const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes'); // ✅ nova rota

// Middleware para servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static('public'));

// Middlewares
app.use(express.json()); // Middleware para processar o corpo das requisições como JSON

// Verificando o corpo da requisição antes das rotas
app.use((req, res, next) => {
  console.log('Corpo da requisição:', req.body); // Log para depuração
  next();
});

// Rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes); // ✅ nova rota de usuários

// Middleware de erro
const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);

// Redirecionar raiz para index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
