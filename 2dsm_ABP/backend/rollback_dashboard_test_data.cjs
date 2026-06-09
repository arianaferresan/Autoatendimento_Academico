const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fatec_auth',
  password: '123',
  port: 5432,
});

async function rollback() {
  try {
    console.log("Iniciando reversão (Rollback) dos dados de teste...");

    // 1. REMOVER SUPORTE E DÚVIDAS MOCKADAS
    const resDuvidas = await pool.query("DELETE FROM support_contacts WHERE email LIKE 'mock_%@fatec.sp.gov.br' OR message LIKE '%[MOCK_DATA]%' RETURNING id");
    console.log(`🧹 Removidas ${resDuvidas.rowCount} dúvidas de teste da tabela support_contacts.`);

    // 2. REMOVER LOGS DE CHAT MOCKADOS
    const resLogs = await pool.query("DELETE FROM fulfillment_logs WHERE navigation_flow::text LIKE '%[MOCK_DATA]%' RETURNING id");
    console.log(`🧹 Removidos ${resLogs.rowCount} logs de interação de teste da tabela fulfillment_logs.`);

    console.log("🚀 Rollback concluído! O banco está limpo e de volta ao estado original.");

  } catch (err) {
    console.error("❌ Erro ao realizar o rollback:", err);
  } finally {
    pool.end();
  }
}

rollback();