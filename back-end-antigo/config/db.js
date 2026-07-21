// Conexão com o banco de dados MySQL usando mysql2 com Promises

const mysql = require('mysql2/promise');
const config = require('./config');

const db = mysql.createPool({
    host: config.dbConfig.host,
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    database: config.dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
  .then(() => {
    console.log('Conectado ao banco de dados MySQL');
  })
  .catch((err) => {
    console.error('Erro na conexão com o banco de dados:', err.message);
  });

module.exports = db;
