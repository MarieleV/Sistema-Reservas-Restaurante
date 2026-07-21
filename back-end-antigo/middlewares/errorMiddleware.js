//Middleware para tratamento de erros
module.exports = (err, req, res, next) => {
  console.error('Erro interno:', err); // Mostra no terminal
  res.status(500).json({
    message: 'Algo deu errado!',
    error: err.message,           // mostra a mensagem do erro
    stack: err.stack              // mostra a origem exata do erro (ajuda no desenvolvimento)
  });
};
