# Backlog Do Produto

Este documento resume o backlog principal do projeto e aponta para os documentos detalhados de apoio.

## Documentos Relacionados

- [User stories](user-stories.md)
- [Definition of Ready (DoR)](../processo/definition-of-ready.md)
- [Definition of Done (DoD)](../processo/definition-of-done.md)
- [Backlog em PDF](../referencias/backlog-do-produto.pdf)

## Legenda De Prioridade

| Prioridade | Uso no backlog |
| --- | --- |
| Alta | Itens obrigatorios para o MVP e para os requisitos centrais do desafio. |
| Media | Itens importantes que ampliam a solucao, mas podem entrar apos o fluxo principal ficar estavel. |
| Baixa | Itens complementares que agregam valor sem bloquear a demonstracao principal. |

## Backlog Funcional

| ID | Titulo | Prioridade | Requisitos |
| --- | --- | --- | --- |
| US01 | Escolha inicial de curso ou perfil | Alta | RF01 |
| US02 | Navegacao por menus e submenus | Alta | RF01 |
| US03 | Consultas diretas no autoatendimento | Media | RF01, RF02 |
| US04 | Respostas resumidas e padronizadas | Alta | RF01, RF02 |
| US05 | Evidencias documentais vinculadas | Alta | RF02 |
| US06 | Perfis de acesso do sistema | Alta | RF03 |
| US07 | Gestao de menus e respostas pelo administrador | Alta | RF04 |
| US08 | Gestao de documentos, chunks e metadados | Alta | RF02, RF04 |
| US09 | Gestao de usuarios da secretaria | Media | RF04 |
| US10 | Encaminhamento de perguntas para a secretaria | Alta | RF05 |
| US11 | Acompanhamento e atualizacao das duvidas recebidas | Alta | RF06 |
| US12 | Avaliacao de satisfacao do atendimento | Baixa | RF07 |
| US13 | Registro e consulta de logs administrativos | Alta | RF04, RF08 |
| US14 | Login, JWT e autorizacao por papel | Alta | RF09, RF10, RF11 |

## Itens Tecnicos E De Entrega

| ID | Titulo | Prioridade |
| --- | --- | --- |
| BT01 | Modelagem e carga inicial do banco PostgreSQL | Alta |
| BT02 | Frontend em React com TypeScript | Alta |
| BT03 | API em Node.js com TypeScript | Alta |
| BT04 | Ambiente completo com Docker Compose | Alta |
| BT05 | Documentacao e diagramas UML | Media |
| BT06 | Seguranca com hash e JWT | Alta |
| BT07 | Validacao basica de desempenho | Media |

## Observacao

Os criterios detalhados de aceite e prontidao foram mantidos fora deste arquivo para evitar duplicacao e facilitar manutencao.
