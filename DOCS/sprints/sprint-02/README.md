# Sprint 02

## Status

Planejamento.

## Período

Preencher.

## Objetivo

Finalizar o núcleo funcional do sistema, consolidando frontend e backend e preparando a integração principal com a base de dados e as regras de acesso.

## Escopo Comprometido

| ID | Item | Prioridade | Recorte da Sprint |
| --- | --- | --- | --- |
| US03 | Consultas diretas no autoatendimento | Média | Implementar a consulta direta como complemento à navegação guiada. |
| US05 | Evidências documentais vinculadas | Alta | Exibir a referência documental vinculada à resposta apresentada ao usuário. |
| US06 | Perfis de acesso do sistema | Alta | Estruturar o acesso público e os perfis internos previstos no sistema. |
| US10 | Encaminhamento de perguntas para a secretaria | Alta | Permitir o envio da dúvida ao final do atendimento. |
| US14 | Login, JWT e autorização por papel | Alta | Implementar a autenticação inicial de usuários internos e o controle de acesso por papel. |
| BT01 | Modelagem e carga inicial do banco PostgreSQL | Alta | Revisar a modelagem existente, validar a estrutura e preparar a base para integração. |
| BT02 | Frontend em React com TypeScript | Alta | Finalizar o frontend do fluxo principal e da integração com os serviços desta etapa. |
| BT03 | API em Node.js com TypeScript | Alta | Implementar a API necessária para sustentar a navegação, autenticação e encaminhamento de perguntas. |
| BT05 | Documentação e diagramas UML | Média | Produzir o diagrama de classes e o diagrama de componentes nesta sprint. |
| BT06 | Segurança com hash e JWT | Alta | Aplicar hash de senha, JWT e proteções básicas de segurança do backend. |

## Entregas

- Frontend principal finalizado para o fluxo público previsto no MVP evoluído.
- Backend funcional para navegação, autenticação e envio de dúvidas.
- Integração principal com a base de dados revisada.
- Diagrama de classes e diagrama de componentes.

## Evidências

- Adicionar links dos PRs, commits, telas integradas e demonstrações desta sprint.
- Adicionar os links do diagrama de classes e do diagrama de componentes quando estiverem finalizados.

## Tasks

- O detalhamento das tasks e a explosão em cards será feito posteriormente com o Scrum Master.

## Riscos e Impedimentos

- A integração entre frontend, backend e banco pode demandar ajustes no contrato da API e no modelo já existente.
- Atrasos na autenticação e no controle de acesso podem impactar o início das entregas internas previstas para a Sprint 03.
- A ampliação de escopo para a área administrativa completa pode comprometer o foco desta sprint.

## Observações

- O foco desta sprint é fechar frontend e backend do núcleo do produto.
- O banco já existente entra em revisão e validação para suportar a integração real desta etapa.
- Painel administrativo completo, pgAdmin, diagrama de sequência e documentação de testes ficam para a Sprint 03.
