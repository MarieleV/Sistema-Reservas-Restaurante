const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
    connectionString: config.dbConfig.connectionString,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('✅ Conectado ao banco de dados Supabase (PostgreSQL)'))
  .catch((err) => console.error('❌ Erro na conexão com o Supabase:', err.message));

// Wrapper mágico para manter a compatibilidade com seu código antigo
const executeQuery = async (sql, params) => {
    // 1. Converte automaticamente os '?' do MySQL para '$1, $2' do PostgreSQL
    let pgSql = sql;
    if (params && params.length > 0) {
        let i = 1;
        pgSql = sql.replace(/\?/g, () => `$${i++}`);
    }

    const res = await pool.query(pgSql, params);

    // 2. Simula o comportamento do mysql2 (que devolve as linhas no índice 0)
    const rows = res.rows;
    
    // Adiciona propriedades extras no array para não quebrar a lógica de insert/update atual
    rows.insertId = res.rows.length > 0 ? res.rows[0].id : null;
    rows.affectedRows = res.rowCount;

    return [rows, res.fields]; // Retorna no formato const [result] = await db.execute()
};

module.exports = {
    execute: executeQuery,
    query: executeQuery,
};