# Sprint 02

## Status

![Status](https://img.shields.io/badge/Status-Em%20andamento-FACC15)

## Período

| Marco | Data |
| --- | --- |
| Entrega prevista | 25/05/2026 |

## Objetivo

Transformar o MVP mockado da Sprint 1 em um fluxo público real, integrado e reproduzível, corrigindo as pendências estruturais apontadas na avaliação e preparando a base técnica e documental necessária para a área interna do sistema.

## Sprint Backlog

| ID | Frente | Item | Prioridade | Recorte da Sprint |
| --- | --- | --- | --- | --- |
| DW01 | Frontend | Escolha inicial de curso ou perfil | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Revisar a tela inicial e garantir que a escolha de curso ou perfil alimente corretamente o fluxo real do chatbot na Sprint 2. |
| DW02 | Frontend | Navegação por menus e submenus | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Migrar o fluxo principal do chatbot para navegação baseada em dados persistidos no banco por meio da API. |
| DW05 | Frontend | Evidências documentais vinculadas | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)  | Exibir evidência documental vinculada às respostas, com referência rastreável no fluxo público. |
| DW07 | Frontend | Frontend em React com TypeScript | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)  | Reorganizar o frontend para integração com serviços, separação entre lógica e interface e tipagem mais robusta. |
| DW08 | Frontend | Tela de e-mail para envio de dúvidas | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Implementar a interface da tela de e-mail no app, com campos de contato e dúvida, validação visual e encaixe no encerramento do fluxo. |
| TP01 | Autenticação e Acesso | Perfis de acesso do sistema | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)  | Formalizar os perfis Aluno, Secretaria Acadêmica e Administrador com matriz de acesso coerente entre frontend, backend e documentação. |
| TP04 | Backend e Dados | Encaminhamento de perguntas para a secretaria | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Permitir o envio real de dúvidas ao final do atendimento, com persistência no banco. |
| TP06 | Autenticação e Acesso | Login, JWT e autorização por papel | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Implementar autenticação mínima no backend, emissão de JWT, Bearer Token e proteção das rotas administrativas já existentes. |
| TP07 | Backend e Dados | API em Node.js com TypeScript | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Refatorar a API com separação em camadas, padronização de rotas e documentação coerente dos endpoints. |
| TP08 | Infraestrutura e Implementação | Ambiente completo com Docker Compose | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Subir frontend, backend e PostgreSQL com comando único, com `.env.example` e documentação de inicialização reproduzível. |
| TP09 | Autenticação e Acesso | Segurança com hash e JWT | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Aplicar hash seguro para senhas, expiração de token e uso correto de variáveis de ambiente para informações sensíveis. |
| BD01 | Backend e Dados | Gestão de documentos e metadados | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Implementar a estrutura mínima de dados e o vínculo com respostas para sustentar evidências documentais no fluxo público; a gestão administrativa completa fica para a Sprint 3. |
| BD03 | Backend e Dados | Modelagem e carga inicial do banco PostgreSQL | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Revisar a modelagem para sustentar navegação, respostas, perguntas, documentos e evidências, com seed suficiente para o MVP. |
| ES01 | Documentação | Documentação do repositório e diagramas UML | ![Prioridade Baixa](https://img.shields.io/badge/Prioridade-Baixa-green) | Corrigir README principal, READMEs das pastas principais e entregar diagramas de Casos de Uso, Classes, Sequência e Componentes coerentes com a implementação. |

## Entregas esperadas

- Tela inicial revisada e integrada ao fluxo real do chatbot.
- Fluxo público do chatbot executando com navegação baseada em banco de dados e API.
- Respostas finais padronizadas com exibição de evidências documentais vinculadas.
- Tela de e-mail integrada ao encerramento do atendimento.
- Envio de dúvidas com persistência real no banco de dados.
- Proteção mínima das rotas administrativas com autenticação, JWT e autorização por papel.
- Ambiente completo executando com Docker Compose.
- Documentação do repositório e diagramas UML atualizados e coerentes com a implementação.

## Evidências



## Tasks

| ID | Descrição | Autor(es) | Data | Pontuação | Status |
| --- | --- | --- | --- | --- | --- |
| BD03.1 | Revisar modelagem relacional do dominio | William, Lucas | - | 27 | ✅ |
| BD03.2 | Ampliar seed do banco com base no Desafio.pdf | William | - | 28 | ✅ |
| DW01.1.1 | Revisão/remodelagem de protótipos | Pedro | 24/05 | 21 | ✅ |
| DW01.1.2 | Página da tela inicial | Pedro | 19/05 | 5 | ✅ |
| DW01.1.3 | Chatbot | Pedro | 19/05 | 5 | ✅ |
| DW01.1.4 | Página administrativa | Pedro | 24/05 | 6 | ✅ |
| DW01.1.5 | Página de login | Pedro | 19/05 | 5 | ✅ |
| DW02 | Substituir navegacao mockada por API | Eloah, William | 24/05 | 34 | ✅ |
| DW07 | Reorganizar frontend para integracao real | Eloah | 24/05 | 55 | ✅ |
| DW08.1.1 | Implementar tela de email | Eloah, William | - | 21 | ✅ |
| DW08.1.2 | Implementar Frontend | Eloah | - | 10 | ✅ |
| DW08.1.3 | Implementar Backend | William | 24/05 | 11 | ✅ |
| ES01.1 | Revisar README principal | Luiza | 18/05 | 2 | ✅ |
| ES01.2 | Revisar indice da documentacao | Luiza | 18/05 | 2 | ✅ |
| ES01.3 | Revisar referencias e anexos | Luiza | 18/05 | 2 | ✅ |
| ES01.4 | Revisar indice dos diagramas | Luiza | 24/05 | 2 | ✅ |
| ES01.5 | Validar DoD do produto | Luiza | 24/05 | 2 | ✅ |
| ES01.6 | Revisar backlog do produto | Luiza | 24/05 | 2 | ✅ |
| ES01.7 | Revisar backlog detalhado | Luiza | 24/05 | 2 | ✅ |
| ES01.8 | Fechar retrospectiva da Sprint 1 | Luiza | 18/05 | 2 | ✅ |
| ES01.9 | Fechar backlog final da Sprint 2 | Luiza | 18/05 | 2 | ✅ |
| ES01.10 | Reorganizar escopo da Sprint 3 | Luiza | 18/05 | 2 | ✅ |
| ES01.11 | Validar READMEs das pastas principais | Luiza | 18/05 | 2 | ✅ |
| ES01.12 | Quebrar backlog da Sprint 2 em tasks rastreaveis | Felipe | 19/05 | 2 | ✅ |
| ES01.13 | Consolidar burndown e evidencias de colaboracao da Sprint 2 | Felipe | - | 2 | ✅ |
| ES01.14 | Rodar checklist final da rubrica da Sprint 2 | Felipe, Luiza | - | 4 | ✅ |
| ES01.15 | Revisar diagrama de Casos de Uso | Ariana | 24/05 | 2 | ✅ |
| ES01.16 | Produzir diagrama de Classes | Ariana | - | 2 | ✅ |
| TP01 | Definir perfis de acesso do sistema | Lucas | 24/05 | 21 | ✅ |
| TP04 | Persistir envio de duvidas | Eloah, William | - | 34 | ✅ |
| TP06.1.1 | Implementar login com JWT e Bearer Token | Lucas | 24/05 | 17 | ✅ |
| TP06.1.2 | Criação de Middleware para proteção de rotas | Lucas | 24/05 | 17 | ✅ |
| TP06.2 | Proteger rotas administrativas | William | 24/05 | 17 | ✅ |
| TP07.1.1 | Refatorar backend para arquitetura em camadas | Lucas, William | 24/05 | 28 | ✅ |
| TP07.1.2 | Login | Lucas | 24/05 | 10 | ✅ |
| TP07.1.3 | Geral | William | 24/05 | 18 | ✅ |
| TP07.2.1 | Padronização de rotas | Lucas, William | 24/05 | 27 | ✅ |
| TP07.2.2 | Login | Lucas | 24/05 | 10 | ✅ |
| TP07.2.3 | Geral | William | 24/05 | 17 | ✅ |
| TP08.1 | Criar .env.example | William | - | 11 | ✅ |
| TP08.2 | Completar docker-compose.yml | William, Eloah | 24/05 | 12 | ✅ |
| TP08.3 | Validar execucao integrada do ambiente | Luiza | - | 11 | ✅ |
| TP09 | Aplicar hash seguro e proteger dados sensiveis | Lucas | 24/05 | 21 | ✅ |



## Burndown





