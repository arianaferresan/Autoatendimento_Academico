# Banco de Dados e Scripts SQL

## Responsabilidade da pasta

Esta pasta concentra os scripts SQL usados para inicializar a base PostgreSQL do projeto.

## Organização interna

| Arquivo | Papel |
| --- | --- |
| `01_schema.sql` | Cria tipos, tabelas e relacionamentos iniciais do sistema |
| `02_seed.sql` | Insere a carga inicial de dados para o chatbot |

## Como esta pasta é usada

- No fluxo com Docker Compose, os arquivos em `init/` são montados no container do PostgreSQL para inicialização automática.
- Em revisões locais, os scripts também podem ser executados manualmente para validar schema e seed.
- A Sprint 2 prioriza ampliar a modelagem e a carga inicial para sustentar navegação, perguntas, logs, documentos e evidências.

## Observação

Embora esta pasta represente a camada de banco do projeto, a documentação geral do domínio de dados também deve ser mantida em `DOCS/diagrama/` e nos artefatos de backlog quando a modelagem evoluir.
