-- Seed: usuários iniciais para desenvolvimento
-- Senhas geradas com bcrypt (salt rounds = 10)
-- Para regenerar: npx ts-node src/utils/hashPassword.ts <senha>
INSERT INTO users (username, password_hash, role, name)
VALUES (
    'admin',
    '$2b$10$obhZ42jNZeqtoknHKxznd.Q34BlfTkstgWA.TldxC40cPc7jmOOOm',
    'admin',
    'Administrador'
  ),
  (
    'secretaria',
    '$2b$10$9/VqMoYJkrug8kox6vNsYeZF0ByG/QCucky0DMQTMTysS/L/X35La',
    'secretaria',
    'Secretaria'
  ) ON CONFLICT (username) DO NOTHING;

DO $seed$
DECLARE 
    v_dsm_id INT;
    v_geo_id INT;
    v_marh_id INT;
    v_nao_aluno_id INT;

    v_dsm_dispensa_id INT;
    v_dsm_estagio_id INT;
    v_dsm_horario_id INT;
    v_geo_dispensa_id INT;
    v_geo_estagio_id INT;
    v_geo_horario_id INT;
    v_marh_dispensa_id INT;
    v_marh_estagio_id INT;
    v_marh_horario_id INT;
BEGIN 
    TRUNCATE TABLE navigation_nodes CASCADE;

    -- ==========================================
    -- NÓS RAIZ
    -- ==========================================
    INSERT INTO navigation_nodes (title, display_order) VALUES ('DSM', 1) RETURNING id INTO v_dsm_id;
    INSERT INTO navigation_nodes (title, display_order) VALUES ('Geoprocessamento', 2) RETURNING id INTO v_geo_id;
    INSERT INTO navigation_nodes (title, display_order) VALUES ('MARH', 3) RETURNING id INTO v_marh_id;
    INSERT INTO navigation_nodes (title, display_order) VALUES ('Não sou aluno', 4) RETURNING id INTO v_nao_aluno_id;

    -- =========================================================================================
    -- MENU: DSM
    -- =========================================================================================
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_id, 'Atividades Complementares (AACC)', $$O curso de Desenvolvimento de Software Multiplataforma não possui Atividades Acadêmico - Científico - Culturais (AACC) previstas em sua matriz curricular.$$, 1);

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_dsm_id, 'Datas importantes do semestre', $$<ul><li>Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026</li><li>Rematrícula de alunos veteranos: 12 a 18/01/2026</li><li>Início das aulas: 09/02/2026</li><li>Prazo para aproveitamento de estudos (Art.76 – via SIGA): 19/02/2026</li><li>Prazo para reconhecimento de competências (Art.80, §1º): 19/02/2026</li><li>Ajustes de matrícula (veteranos – Art.26, §4º): 19/02/2026</li><li>Exame de nivelamento com ajuste de horário (Art.87, §1º): 21/02/2026</li><li>Ajustes de matrícula (ingressantes – Art.25, §2º): 23/02/2026</li><li>Exame de nivelamento sem ajuste de horário: 27/02/2026</li><li>Cancelamento por ausência de rematrícula (Art.28): 02/03/2026</li><li>Prazo final para desistência de disciplina (Art.30): 25/03/2026</li><li>Prazo final para trancamento (exceto ingressantes – Art.31, §3º): 13/05/2026</li><li>Término das aulas: 27/06/2026</li><li>Período de exames finais (Art.34): 06 a 08/07/2026</li></ul>Acesse o calendário completo no link abaixo:$$, '/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf', 2);

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_dsm_id, 'Disciplinas com atividades de extensão', $$No curso de DSM, as atividades de extensão estão vinculadas ao ABP e às seguintes disciplinas...(Consulte o PPC para lista completa).$$, '/assets/knowledge-base/pdf/DSM-PPC.pdf', 3);

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_dsm_id, 'Disciplinas remotas', $$No 5º semestre: Inglês III e Fundamentos da Redação Técnica. No 6º semestre todas remotas.$$, '/assets/knowledge-base/pdf/DSM-PPC.pdf', 4);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_id, 'Portfólio', $$O curso não possui Trabalho de Graduação (TG). O TG é substituído pela construção do Portfólio Digital. Os projetos do 4º, 5º e 6º semestres compõem o portfólio. O portfólio deve ser hospedado em repositório privado. Para orientações, contate: marcelo.sudo@fatec.sp.gov.br$$, 8);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_id, 'Trabalho de Graduação (TG/TCC)', $$O curso não possui Trabalho de Graduação (TG). O TG é substituído pela construção do Portfólio Digital. Os projetos do 4º, 5º e 6º semestres compõem o portfólio. O portfólio deve ser hospedado em repositório privado. Para orientações, contate: marcelo.sudo@fatec.sp.gov.br$$, 9);

    -- Submenu: DSM > Dispensa
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_id, 'Dispensa de disciplinas', $$Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular. No DSM as disciplinas de extensão curricular são aquelas vinculadas ao ABP. Escolha a modalidade desejada:$$, 5)
    RETURNING id INTO v_dsm_dispensa_id;

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_dispensa_id, 'Aproveitamento de estudos – disciplina cursada em outra instituição de ensino superior', $$É possível solicitar a dispensa...(via SIGA). Similaridade >= 70% aprovação direta.$$, 1);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_dispensa_id, 'Reconhecimento de competências – disciplinas cursadas na Etec', $$É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec...$$, 2);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_dispensa_id, 'Aproveitamento de conhecimentos e experiências anteriores', $$Para solicitar, é necessário Diploma(s) ou certificado(s)...$$, 3);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_dispensa_id, 'Proficiência em Inglês', $$No início do 3º semestre é aplicada a prova de proficiência em Inglês para todos os alunos (Plataforma: NEPLE).$$, 4);

    -- Submenu: DSM > Estágio
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_id, 'Estágio', $$Escolha a opção:$$, 6)
    RETURNING id INTO v_dsm_estagio_id;

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_estagio_id, 'Duração do estágio supervisionado', $$Carga horária obrigatória: 240 horas. Pode iniciar: a partir do 1º semestre.$$, 1);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_estagio_id, 'Início do estágio', $$O estágio deve ser intermediado por empresa ou agente de integração. Contato: f258adm@cps.sp.gov.br$$, 2);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_estagio_id, 'Comprovação', $$Após concluir as 240 horas de estágio, o aluno deve elaborar o Relatório Final de Estágio.$$, 3);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_estagio_id, 'Equiparação de estágio', $$O estágio pode ser comprovado por meio de Iniciação Científica, Monitoria ou Atividade profissional.$$, 4);

    -- Submenu: DSM > Horário das aulas
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_dsm_id, 'Horário das aulas', $$Qual semestre você deseja consultar?$$, 7)
    RETURNING id INTO v_dsm_horario_id;

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_dsm_horario_id, '1º semestre', $$Horário de aulas do 1º semestre.$$, '/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf', 1),
    (v_dsm_horario_id, '2º semestre', $$Horário de aulas do 2º semestre.$$, '/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf', 2),
    (v_dsm_horario_id, '3º semestre', $$Horário de aulas do 3º semestre.$$, '/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf', 3),
    (v_dsm_horario_id, '4º semestre', $$Horário de aulas do 4º semestre.$$, '/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf', 4),
    (v_dsm_horario_id, '5º semestre', $$Horário de aulas do 5º semestre.$$, '/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf', 5),
    (v_dsm_horario_id, '6º semestre', $$Horário de aulas do 6º semestre.$$, '/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf', 6);

    -- =========================================================================================
    -- MENU: GEOPROCESSAMENTO
    -- =========================================================================================
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_geo_id, 'Atividades Complementares (AACC)', $$É necessário cumprir 60 horas de AACC.$$, 1);

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_geo_id, 'Datas importantes do semestre', $$Calendário Acadêmico padrão. Acesse o calendário completo no link abaixo:$$, '/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf', 2);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES
    (v_geo_id, 'Disciplinas remotas', $$O curso não possui disciplinas remotas.$$, 3),
    (v_geo_id, 'Portfólio', $$Geoprocessamento não possui Portfólio; possui TG iniciado no 5º semestre.$$, 7),
    (v_geo_id, 'Trabalho de Graduação (TG/TCC)', $$O TG deve ser iniciado no 5º semestre...(formato artigo científico).$$, 8);

    -- Submenu: GEO > Dispensa
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_geo_id, 'Dispensa de disciplinas', $$Escolha a modalidade desejada:$$, 4)
    RETURNING id INTO v_geo_dispensa_id;

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_geo_dispensa_id, 'Aproveitamento de estudos', $$Regras de aproveitamento (similaridade).$$, 1),
    (v_geo_dispensa_id, 'Reconhecimento de competências', $$Cursos técnicos da Etec.$$, 2),
    (v_geo_dispensa_id, 'Aproveitamento de experiências', $$Diploma ou certificado com exame de proficiência.$$, 3),
    (v_geo_dispensa_id, 'Proficiência em Inglês', $$No início do 1º semestre é aplicada a prova de proficiência.$$, 4);

    -- Submenu: GEO > Estágio
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_geo_id, 'Estágio', $$Escolha a opção:$$, 5)
    RETURNING id INTO v_geo_estagio_id;

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_geo_estagio_id, 'Duração do estágio supervisionado', $$Carga horária: 180 horas. A partir do 4º semestre.$$, 1),
    (v_geo_estagio_id, 'Início do estágio', $$Intermediado por empresa (f258adm@cps.sp.gov.br).$$, 2),
    (v_geo_estagio_id, 'Comprovação', $$Relatório Final de Estágio.$$, 3),
    (v_geo_estagio_id, 'Equiparação de estágio', $$Iniciação Científica, Monitoria, Atividade profissional.$$, 4);

    -- Submenu: GEO > Horário das aulas
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_geo_id, 'Horário das aulas', $$Qual semestre você deseja consultar?$$, 6)
    RETURNING id INTO v_geo_horario_id;

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_geo_horario_id, '1º semestre', NULL, '/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf', 1),
    (v_geo_horario_id, '2º semestre', NULL, '/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf', 2),
    (v_geo_horario_id, '3º semestre', NULL, '/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf', 3),
    (v_geo_horario_id, '4º semestre', $$O 4º semestre não está sendo oferecido$$, NULL, 4),
    (v_geo_horario_id, '5º semestre', NULL, '/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf', 5),
    (v_geo_horario_id, '6º semestre', $$O 6º semestre não está sendo oferecido$$, NULL, 6);

    -- =========================================================================================
    -- MENU: MARH
    -- =========================================================================================
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_marh_id, 'Atividades Complementares (AACC)', $$É necessário cumprir 60 horas de AACC.$$, 1);

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_marh_id, 'Datas importantes do semestre', $$Calendário Acadêmico padrão. Acesse o calendário completo no link abaixo:$$, '/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf', 2);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES
    (v_marh_id, 'Disciplinas remotas', $$No 5º semestre: 20% da carga horária. No 6º semestre: Todas remotas.$$, 3),
    (v_marh_id, 'Portfólio', $$MARH não possui Portfólio; possui TG iniciado no 5º semestre.$$, 7),
    (v_marh_id, 'Trabalho de Graduação (TG/TCC)', $$O TG deve ser iniciado no 5º semestre...$$, 8);

    -- Submenu: MARH > Dispensa
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_marh_id, 'Dispensa de disciplinas', $$Escolha a modalidade desejada:$$, 4)
    RETURNING id INTO v_marh_dispensa_id;

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_marh_dispensa_id, 'Aproveitamento de estudos', $$Regras de aproveitamento (similaridade).$$, 1),
    (v_marh_dispensa_id, 'Reconhecimento de competências', $$Cursos técnicos da Etec.$$, 2),
    (v_marh_dispensa_id, 'Aproveitamento de experiências', $$Diploma ou certificado com exame de proficiência.$$, 3),
    (v_marh_dispensa_id, 'Proficiência em Inglês', $$No início do 1º semestre é aplicada a prova de proficiência.$$, 4);

    -- Submenu: MARH > Estágio
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_marh_id, 'Estágio', $$Escolha a opção:$$, 5)
    RETURNING id INTO v_marh_estagio_id;

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_marh_estagio_id, 'Duração do estágio supervisionado', $$Carga horária: 180 horas. A partir do 4º semestre.$$, 1),
    (v_marh_estagio_id, 'Início do estágio', $$Intermediado por empresa (f258adm@cps.sp.gov.br).$$, 2),
    (v_marh_estagio_id, 'Comprovação', $$Relatório Final de Estágio.$$, 3),
    (v_marh_estagio_id, 'Equiparação de estágio', $$Iniciação Científica, Monitoria, Atividade profissional.$$, 4);

    -- Submenu: MARH > Horário das aulas
    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_marh_id, 'Horário das aulas', $$Qual semestre você deseja consultar?$$, 6)
    RETURNING id INTO v_marh_horario_id;

    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_marh_horario_id, '1º semestre', NULL, '/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf', 1),
    (v_marh_horario_id, '2º semestre', NULL, '/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf', 2),
    (v_marh_horario_id, '3º semestre', NULL, '/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf', 3),
    (v_marh_horario_id, '4º semestre', NULL, '/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf', 4),
    (v_marh_horario_id, '5º semestre', NULL, '/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf', 5),
    (v_marh_horario_id, '6º semestre', $$O 6º semestre não está sendo oferecido$$, NULL, 6);

    -- =========================================================================================
    -- MENU: NÃO SOU ALUNO
    -- =========================================================================================
    INSERT INTO navigation_nodes (parent_id, title, content, link, display_order) VALUES 
    (v_nao_aluno_id, 'A Fatec possui cursos técnicos?', $$A Fatec oferece exclusivamente cursos de graduação tecnológica. Para cursos técnicos, acesse o link abaixo:$$, 'https://vestibulinho.etec.sp.gov.br', 1);

    INSERT INTO navigation_nodes (parent_id, title, content, display_order) VALUES 
    (v_nao_aluno_id, 'Como ingressar na Fatec?', $$O ingresso na Fatec ocorre por meio de vestibular duas vezes ao ano.$$, 2),
    (v_nao_aluno_id, 'Como realizar a matrícula?', $$A matrícula é online por meio do portal oficial do vestibular.$$, 3),
    (v_nao_aluno_id, 'Cursos oferecidos na Fatec Jacareí', $$DSM, Geoprocessamento e MARH. Todos no período noturno.$$, 4),
    (v_nao_aluno_id, 'Horários das aulas', $$As aulas de todos os cursos ocorrem no período noturno, das 18h45 às 23h05.$$, 5);

END $seed$;
