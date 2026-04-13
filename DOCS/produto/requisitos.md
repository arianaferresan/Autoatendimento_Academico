# Requisitos Do Projeto

## Requisitos Funcionais

| ID | Requisito | Descricao breve |
| --- | --- | --- |
| RF01 | Navegacao conversacional | O sistema deve funcionar como chatbot com menus e submenus hierarquicos, guiando o usuario conforme suas escolhas. |
| RF02 | Repositorio de conhecimento | O sistema deve manter base estruturada com nos de navegacao, perguntas, respostas, documentos, chunks e metadados. |
| RF03 | Perfis de usuario | O sistema deve atender os perfis Aluno, Secretaria Academica e Administrador, com acessos distintos. |
| RF04 | Gestao de conteudo | O administrador deve poder gerenciar menus, respostas, documentos, usuarios da secretaria e logs. |
| RF05 | Encaminhamento de pergunta | Ao final do atendimento, o usuario deve poder enviar uma duvida para a secretaria com texto e e-mail institucional. |
| RF06 | Gestao de perguntas | A Secretaria Academica deve poder listar perguntas recebidas e atualizar o status de cada uma. |
| RF07 | Avaliacao de satisfacao | O usuario deve poder informar se gostou ou nao da interacao com o sistema. |
| RF08 | Registro de logs | O sistema deve registrar navegacao, perguntas enviadas, satisfacao e data/hora de cada atendimento. |
| RF09 | Autenticacao | Secretaria Academica e Administrador devem acessar por login e senha, enquanto o Aluno permanece sem autenticacao. |
| RF10 | Autorizacao por papel | O sistema deve aplicar RBAC para limitar cada funcionalidade ao papel correto. |
| RF11 | Protecao de rotas | As rotas administrativas devem ser protegidas por middleware com validacao obrigatoria do token. |

## Requisitos Nao Funcionais

| ID | Requisito | Descricao breve |
| --- | --- | --- |
| RNF01 | Usabilidade e responsividade | A interface deve ser simples, clara e adaptada para navegadores e dispositivos moveis. |
| RNF02 | Desempenho | O sistema deve responder rapidamente, inclusive em consultas ao banco e recuperacao de trechos documentais. |
| RNF03 | Documentacao tecnica | O projeto deve incluir visao geral, modelo de dados, arquitetura, execucao e documentacao da API. |
| RNF04 | Modelagem UML | O projeto deve apresentar diagramas de casos de uso, classes, sequencia e componentes. |
| RNF05 | Containerizacao | O sistema deve rodar com Docker usando, no minimo, containers de PostgreSQL, backend e frontend. |
| RNF06 | Orquestracao de containers | O ambiente deve poder ser iniciado com comando unico usando ferramenta como Docker Compose. |
| RNF07 | Documentacao do repositorio | O repositorio deve ter READMEs, descricao das funcionalidades, estrutura, diagramas e instrucoes de execucao. |
| RNF08 | Autenticacao com JWT | A autenticacao deve usar JWT com identificador, papel e expiracao enviados no cabecalho Authorization. |
| RNF09 | Seguranca | O sistema deve proteger senhas, chaves sensiveis, expiracao de token e dados expostos pela API. |

## Restricoes De Projeto

| ID | Restricao | Descricao breve |
| --- | --- | --- |
| RP01 | Frontend | O frontend deve ser desenvolvido obrigatoriamente em React com TypeScript. |
| RP02 | Backend | O backend deve ser desenvolvido obrigatoriamente em Node.js com TypeScript e endpoints HTTP. |
| RP03 | Banco de dados | O banco deve ser obrigatoriamente PostgreSQL, com uso explicito de DDL e DML. |
| RP04 | Execucao containerizada | Toda a aplicacao deve rodar exclusivamente por meio de containers Docker. |
| RP05 | MVP | O escopo deve priorizar um MVP funcional com navegacao completa, respostas estruturadas e evidencias documentais. |
| RP06 | JWT obrigatorio | A autenticacao deve ser implementada no backend com JWT, sem depender apenas do frontend. |
