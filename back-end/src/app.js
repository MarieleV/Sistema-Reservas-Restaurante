require('dotenv').config();
const express = require('express');
const app = express();

const clienteRoutes = require('./src/modules/clientes/clienteRoutes');
const reservaRoutes = require('./src/modules/reservas/reservaRoutes');
const authRoutes = require('./src/modules/auth/authRoutes');
const usuarioRoutes = require('./src/modules/usuarios/usuarioRoutes'); 

// Middleware para servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static('public'));

// Middlewares
app.use(express.json()); // Middleware para processar o corpo das requisições como JSON

// Verificando o corpo da requisição antes das rotas
app.use((req, res, next) => {
  console.log('Corpo da requisição:', req.body);
  next();
});

// Rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

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
