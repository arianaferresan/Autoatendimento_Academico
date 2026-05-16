# FAQtec

<p align="center">
  <strong>Aplicação web de autoatendimento acadêmico para a Secretaria Acadêmica da Fatec Jacareí.</strong>
</p>

<p align="center">
  <a href="#contexto-do-desafio">Contexto</a> •
  <a href="#arquitetura-geral">Arquitetura</a> •
  <a href="#como-executar">Execução</a> •
  <a href="#documentacao">Documentação</a>
</p>

---

## Contexto do desafio

O FAQtec nasce do desafio acadêmico proposto para o ABP 2026-1 da Fatec Jacareí: reduzir a sobrecarga da Secretaria Acadêmica em dúvidas recorrentes de alunos e interessados externos, especialmente sobre horários, calendário acadêmico, dispensa de disciplinas, estágio supervisionado e estrutura curricular.

O desafio oficial solicitado pelo cliente interno está registrado em `DOCS/referencias/Desafio.pdf`.

## Objetivo do sistema

O sistema deve funcionar como um chatbot conversacional capaz de:

- conduzir o usuário por uma árvore de navegação com menus e submenus;
- permitir consultas sobre temas acadêmicos recorrentes;
- apresentar respostas objetivas e padronizadas;
- exibir evidências documentais quando houver vínculo com a resposta;
- encaminhar dúvidas não resolvidas para a Secretaria Acadêmica.

## Estado atual do repositório

- O frontend atual já possui um fluxo público navegável, mas ainda depende fortemente de dados mockados.
- O backend em TypeScript já expõe rotas HTTP e documentação Swagger, mas a separação completa em camadas e a proteção das rotas administrativas fazem parte do trabalho da Sprint 2.
- O banco PostgreSQL já possui schema e seed iniciais, mas a modelagem ainda está em revisão para sustentar documentos, chunks, evidências e logs de forma mais completa.
- O replanejamento das correções apontadas pelo professor foi incorporado ao backlog do produto, aos READMEs das sprints e à documentação principal do repositório.

## Arquitetura geral

| Camada | Papel no projeto | Situação atual |
| --- | --- | --- |
| Frontend | Interface do chatbot e futuros painéis internos | Implementado em React + TypeScript, com fluxo público inicial |
| Backend | API HTTP, regras de negócio, autenticação e integração com banco | Implementado em Node.js + Express + TypeScript |
| Banco de dados | Persistência dos nós de navegação, usuários, perguntas, logs e evidências | Implementado em PostgreSQL, com schema e seed iniciais |
| Documentação | Requisitos, backlog, sprints, processo e diagramas | Mantida na pasta `DOCS/` |

## Estrutura do repositório

```text
.
├── 2dsm_ABP/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── server/
│   │   │   └── server.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── init/
│   │   ├── 01_schema.sql
│   │   └── 02_seed.sql
│   ├── docker-compose.yml
│   └── .gitignore
├── DOCS/
│   ├── diagrama/
│   ├── processo/
│   ├── produto/
│   ├── referencias/
│   ├── sprints/
│   └── README.md
└── README.md
```

## Tecnologias utilizadas

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- ESLint

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL (`pg`)
- Swagger UI
- Multer
- dotenv

### Banco e infraestrutura

- PostgreSQL 15
- Docker Compose
- Scripts SQL de schema e seed

## Variáveis de ambiente

Atualmente, o projeto utiliza variáveis de ambiente para conexão com o banco e configuração do backend.

| Variável | Uso |
| --- | --- |
| `PORT` | Porta do backend |
| `DB_HOST` | Host do PostgreSQL |
| `DB_PORT` | Porta do PostgreSQL |
| `DB_NAME` | Nome do banco |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |

### Onde configurar

- Para `docker compose`, crie um arquivo `.env` em `2dsm_ABP/`.
- Para executar o backend localmente fora do Docker, replique as mesmas variáveis em `2dsm_ABP/backend/.env` ou exporte-as no ambiente de execução.

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Docker e Docker Compose

### Modo atual do repositório

No estado atual do código, o `docker-compose.yml` sobe banco e backend. O frontend ainda deve ser executado separadamente via Vite.

#### 1. Subir banco e backend com Docker Compose

Crie `2dsm_ABP/.env` com as variáveis listadas acima e execute:

```bash
docker compose up --build
```

Comando a partir de `2dsm_ABP/`.

#### 2. Executar o frontend localmente

Em `2dsm_ABP/frontend/`:

```bash
npm install
npm run dev
```

#### 3. Executar o backend localmente

Em `2dsm_ABP/backend/`:

```bash
npm install
npm run dev
```

### Build

Frontend, em `2dsm_ABP/frontend/`:

```bash
npm run build
```

Backend, em `2dsm_ABP/backend/`:

```bash
npm run build
```

## Endpoints principais

- Swagger: `http://localhost:3666/api-docs`
- API pública: `http://localhost:3666/api`
- Rotas administrativas atuais: `http://localhost:3666/admin`

> Observação: a proteção completa das rotas administrativas com JWT e RBAC faz parte do escopo priorizado da Sprint 2.

## Documentação

- [Índice geral da documentação](DOCS/README.md)
- [README do frontend](2dsm_ABP/frontend/README.md)
- [README do backend](2dsm_ABP/backend/README.md)
- [README do banco e scripts SQL](2dsm_ABP/init/README.md)
- [Backlog do produto](DOCS/produto/backlog-do-produto.md)
- [Backlog detalhado](DOCS/produto/backlog-detalhado.md)
- [Definition of Ready](DOCS/processo/definition-of-ready.md)
- [Definition of Done](DOCS/processo/definition-of-done.md)
- [Sprints](DOCS/sprints/README.md)
- [Diagramas](DOCS/diagrama/README.md)

## Status do projeto

Projeto acadêmico em desenvolvimento. O replanejamento atual prioriza a conversão do fluxo mockado da Sprint 1 em um MVP público real, integrado e reproduzível na Sprint 2.

## Equipe

| Função | Nome | Contatos |
| --- | --- | :---: |
| Project Owner | Luiza Gonçalves Manchini | [![GitHub](https://img.shields.io/badge/GitHub-Perfil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/luiza-manchini) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luiza-manchini-b51a7b336/) |
| Scrum Master | Felipe Faria Machado | [![GitHub](https://img.shields.io/badge/GitHub-Perfil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/felipefmac) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/felipefariamachado) |
| Dev Team | Ariana Ferreira dos Santos | [![GitHub](https://img.shields.io/badge/GitHub-Perfil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/arianaferresan) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://br.linkedin.com/in/arianaferreira) |
| Dev Team | Eloah Sousa da Silva | [![GitHub](https://img.shields.io/badge/GitHub-Perfil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/eloahsousaa) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eloah-sousa-650038349/) |
| Dev Team | Lucas Monteiro Correia | [![GitHub](https://img.shields.io/badge/GitHub-Perfil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/lucasmonteiro14) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucasmonteirocorreia) |
| Dev Team | Pedro Gonçalves Sampaio | [![GitHub](https://img.shields.io/badge/GitHub-Perfil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/PedroSmp) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pedro-sampaio-463a77375) |
| Dev Team | William Max dos Santos Silva | [![GitHub](https://img.shields.io/badge/GitHub-Perfil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/WilliamM4x) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/william-max-7b8036140/) |

---

<p align="center">
  Desenvolvido para o ABP 2026-1 • Fatec Jacareí
</p>
