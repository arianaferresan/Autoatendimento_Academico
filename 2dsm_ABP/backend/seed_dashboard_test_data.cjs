const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fatec_auth',
  password: '123',
  port: 5432,
});

function randomDate(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const hour = Math.floor(Math.random() * 14) + 8; // 8h as 22h
  const minute = Math.floor(Math.random() * 60);
  // Note: JavaScript months are 0-indexed (0 = Jan, 5 = Jun)
  return new Date(year, month - 1, day, hour, minute);
}

function getRandomSatisfaction() {
  const rand = Math.random() * 100;
  if (rand < 5) return 'RUIM';
  if (rand < 15) return 'SATISFATÓRIO';
  if (rand < 40) return 'BOM';
  if (rand < 75) return 'MUITO BOM';
  return 'ÓTIMO';
}

function getRandomCourse() {
  const courses = [
    { title: 'DSM', id: 165 },
    { title: 'Geoprocessamento', id: 166 },
    { title: 'MARH', id: 167 },
    { title: 'Não sou aluno', id: 168 }
  ];
  return courses[Math.floor(Math.random() * courses.length)];
}

const duvidasTemplates = [
  "Como solicitar estágio obrigatório?",
  "Como emitir histórico escolar online?",
  "Como trancar a minha matrícula?",
  "Como solicitar aproveitamento de disciplinas de outra faculdade?",
  "Como alterar meu e-mail institucional corporativo?",
  "Como funciona a entrega das horas de AACC?",
  "Não consigo acessar o SIGA, dá erro de senha.",
  "Até que dia posso entregar o TG?",
  "Quais são os horários das aulas do 1º semestre?",
  "Como faço para solicitar passe escolar (EMTU)?",
  "Esqueci minha senha do Teams, o que fazer?",
  "Qual o contato do coordenador do curso?"
];

async function seed() {
  try {
    console.log("Iniciando carga de dados de teste (Mock)...");

    // 1. GERAR SUPORTE E DÚVIDAS (support_contacts)
    const doubtDistribution = { 1: 15, 2: 25, 3: 35, 4: 20, 5: 40, 6: 30 };
    let doubtCount = 0;

    for (const [month, count] of Object.entries(doubtDistribution)) {
      for (let i = 0; i < count; i++) {
        const date = randomDate(2026, Number(month));
        const email = `mock_aluno${Math.floor(Math.random() * 9999)}@fatec.sp.gov.br`;
        const msg = duvidasTemplates[Math.floor(Math.random() * duvidasTemplates.length)] + " [MOCK_DATA]";
        
        // Em meses velhos (1 a 5), a maioria está respondida. Em Junho (6), há mais abertas.
        let status = 'RESPONDIDA';
        if (Number(month) === 6 && Math.random() > 0.4) {
          status = 'ABERTA';
        }

        await pool.query(
          "INSERT INTO support_contacts (email, message, status, created_at) VALUES ($1, $2, $3::inquiry_status, $4)",
          [email, msg, status, date.toISOString()]
        );
        doubtCount++;
      }
    }
    console.log(`✅ Inseridas ${doubtCount} dúvidas na tabela support_contacts.`);

    // 2. GERAR LOGS DE CHAT (fulfillment_logs)
    // Cerca de 800 interações divididas pelos meses
    const logDistribution = { 1: 80, 2: 110, 3: 180, 4: 120, 5: 200, 6: 150 };
    let logCount = 0;

    for (const [month, count] of Object.entries(logDistribution)) {
      for (let i = 0; i < count; i++) {
        const date = randomDate(2026, Number(month));
        const course = getRandomCourse();
        
        // Simular um "sub-nível" fictício (como Estágio, Matrícula) associado ao curso principal
        const subId = course.id + Math.floor(Math.random() * 5) + 1; 
        const subTitle = ["Matrícula", "Estágio", "Horários", "TCC", "Documentos"][Math.floor(Math.random() * 5)];

        const flow = [
          course,
          { title: subTitle, id: subId },
          { title: "[MOCK_DATA]", id: 99999 } // Tag escondida no flow para rollback fácil
        ];
        
        const ids = [course.id, subId, 99999];

        // 20% das sessões o aluno fecha sem avaliar (null)
        let flag = null;
        if (Math.random() > 0.20) {
          flag = getRandomSatisfaction();
        }

        await pool.query(
          "INSERT INTO fulfillment_logs (navigation_flow, inquiry_ids, flag, created_at) VALUES ($1, $2, $3, $4)",
          [JSON.stringify(flow), JSON.stringify(ids), flag, date.toISOString()]
        );
        logCount++;
      }
    }
    console.log(`✅ Inseridos ${logCount} logs de interação na tabela fulfillment_logs.`);
    console.log("🚀 Carga finalizada com sucesso!");

  } catch (err) {
    console.error("❌ Erro ao gerar dados de teste:", err);
  } finally {
    pool.end();
  }
}

seed();