# Backlog do Produto

Este documento resume o backlog principal do projeto e aponta para os documentos detalhados de apoio.

## Documentos Relacionados

- [User stories](user-stories.md)
- [Definition of Ready (DoR)](../processo/definition-of-ready.md)
- [Definition of Done (DoD)](../processo/definition-of-done.md)
- [Backlog detalhado](backlog-detalhado.md)

## Legenda de Prioridade

| Prioridade | Uso no backlog |
| --- | --- |
| Alta | Itens obrigatórios para o MVP e para os requisitos centrais do desafio. |
| Média | Itens importantes que ampliam a solução, mas podem entrar após o fluxo principal ficar estável. |
| Baixa | Itens complementares que agregam valor sem bloquear a demonstração principal. |

## Backlog Funcional

| ID | Título | Prioridade | Requisitos |
| --- | --- | --- | --- |
| US01 | Escolha inicial de curso ou perfil | Alta | RF01 |
| US02 | Navegação por menus e submenus | Alta | RF01 |
| US03 | Consultas diretas no autoatendimento | Média | RF01, RF02 |
| US04 | Respostas resumidas e padronizadas | Alta | RF01, RF02 |
| US05 | Evidências documentais vinculadas | Alta | RF02 |
| US06 | Perfis de acesso do sistema | Alta | RF03 |
| US07 | Gestão de menus e respostas pelo administrador | Alta | RF04 |
| US08 | Gestão de documentos, chunks e metadados | Alta | RF02, RF04 |
| US09 | Gestão de usuários da secretaria | Média | RF04 |
| US10 | Encaminhamento de perguntas para a secretaria | Alta | RF05 |
| US11 | Acompanhamento e atualização das dúvidas recebidas | Alta | RF06 |
| US12 | Avaliação de satisfação do atendimento | Baixa | RF07 |
| US13 | Registro e consulta de logs administrativos | Alta | RF04, RF08 |
| US14 | Login, JWT e autorização por papel | Alta | RF09, RF10, RF11 |

## Itens Técnicos e de Entrega

| ID | Título | Prioridade |
| --- | --- | --- |
| BT01 | Modelagem e carga inicial do banco PostgreSQL | Alta |
| BT02 | Frontend em React com TypeScript | Alta |
| BT03 | API em Node.js com TypeScript | Alta |
| BT04 | Ambiente completo com Docker Compose | Alta |
| BT05 | Documentação e diagramas UML | Média |
| BT06 | Segurança com hash e JWT | Alta |
| BT07 | Validação básica de desempenho | Média |

## Observação

Os critérios detalhados de aceite e prontidão foram mantidos fora deste arquivo para evitar duplicação e facilitar a manutenção.
