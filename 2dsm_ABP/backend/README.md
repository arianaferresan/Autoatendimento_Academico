# Backend

## Responsabilidade da pasta

Esta pasta concentra a API HTTP do FAQtec, responsável por expor rotas públicas e administrativas, integrar o sistema ao PostgreSQL e sustentar autenticação, persistência e regras de negócio.

## Tecnologias

- Node.js
- Express
- TypeScript
- PostgreSQL (`pg`)
- Swagger UI
- Multer
- dotenv

## Organização interna atual

| Caminho | Papel |
| --- | --- |
| `src/server.ts` | Inicialização do servidor Express |
| `src/routes/` | Agrupamento das rotas públicas e administrativas |
| `src/controllers/` | Controllers atuais da API |
| `src/server/config/` | Configurações de banco, Swagger e upload |

## Scripts principais

Em `2dsm_ABP/backend/`:

```bash
npm install
npm run dev
npm run build
```

## Variáveis de ambiente

O backend depende, no mínimo, de:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Para execução local, configure essas variáveis em `2dsm_ABP/backend/.env` ou exporte-as no ambiente de execução.

## Situação atual

- O backend já expõe rotas HTTP e documentação Swagger em `/api-docs`.
- A estrutura ainda está em consolidação para atender à separação esperada entre routes, controllers, services, repositories e middlewares.
- A Sprint 2 prioriza essa reorganização, além de autenticação com JWT, proteção de rotas e persistência real do fluxo público.
