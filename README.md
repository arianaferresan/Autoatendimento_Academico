# Portal Atendimento  - ABP2

<p align="center">
  <img src="https://github.com/404NotFound-ABP/AgriRSLAB_Portal/blob/76a8c62e6c347c423505e24162cd9b520b5d316c/imagens/1.1Imagens%20Git/logo_404notfound.png"
       alt="Logo 404NotFound"
       style="max-width: 260px; width: 60%; height: auto;">
</p>
<p align="center">
  <a href="#sobre">Sobre o Projeto</a> |
  <a href="#backlogs">Product Backlog</a> |
  <a href="#sprint">Entrega de Sprints</a> |
  <a href="#tecnologias">Tecnologias</a> |
  <a href="#equipe">Nossa Equipe</a>
</p>

<a id="sobre"></a>
# Sobre o Projeto 📋

## Dor do cliente hoje

Atualmente, a Secretaria Academica da Fatec Jacarei enfrenta um cenario de elevada demanda por atendimentos recorrentes relacionados a duvidas sobre matricula, rematricula, documentos, prazos e procedimentos institucionais. Grande parte dessas informacoes encontra-se distribuida em regulamentos, comunicados e documentos oficiais, o que dificulta sua consulta rapida e objetiva por parte dos alunos e do publico externo. Como consequencia, o atendimento passa a depender intensamente da mediacao humana, gerando sobrecarga operacional para a equipe, aumento no tempo de resposta, retrabalho e possivel inconsistencia na padronizacao das orientacoes fornecidas.

## Soluçao proposta

Como resposta a essa problematica, propoe-se o desenvolvimento de uma aplicacao web de autoatendimento para a Secretaria Academica, estruturada em fluxos guiados de navegacao e consulta de informacoes institucionais. A solucao busca centralizar o acesso ao conhecimento oficial, oferecer respostas padronizadas com base em fontes documentais rastreaveis e reduzir a dependencia de atendimentos manuais para demandas repetitivas. Alem disso, o sistema preve o encaminhamento de duvidas nao resolvidas a equipe da secretaria, preservando a continuidade do atendimento e contribuindo para maior eficiencia, organizacao e qualidade na comunicacao com os usuarios.


[↑ Voltar ao topo](#topo)


# Requisitos 📋 

## Funcionais (RF)

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

## Não Funcionais (RNF)

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

## Restriçoẽs de Projeto (RP)

| ID | Requisito | Descricao breve |
| --- | --- | --- |
| RP01 | Frontend | O frontend deve ser desenvolvido obrigatoriamente em React com TypeScript. |
| RP02 | Backend | O backend deve ser desenvolvido obrigatoriamente em Node.js com TypeScript e endpoints HTTP. |
| RP03 | Banco de dados | O banco deve ser obrigatoriamente PostgreSQL, com uso explicito de DDL e DML. |
| RP04 | Execucao containerizada | Toda a aplicacao deve rodar exclusivamente por meio de containers Docker. |
| RP05 | MVP | O escopo deve priorizar um MVP funcional com navegacao completa, respostas estruturadas e evidencias documentais. |
| RP06 | JWT obrigatorio | A autenticacao deve ser implementada no backend com JWT, sem depender apenas do frontend. |

<a id="sprint"></a>
# Entregas de Sprints 🎯

Todas as entregas serão realizadas conforme os prazos acordados com o cliente. Para cada ciclo de desenvolvimento, será gerado um relatório completo por sprint e uma planilha de tarefas, na aba **Tasks**, que detalha cada atividade executada, o responsável, a data de conclusão e uma descrição do trabalho realizado. A relação detalhada das sprints e tarefas é apresentada abaixo.

<div align="center">

| Sprint | Entrega       | Status |                 Relatório                  | Vídeo | Tasks |
|------: |---------------|:------:|:------------------------------------------:|:-----:|:-----:|
| 1      | 📅 00/00/2026 | —     | [Ver Backlog](docs/sprint1.md#backlog)     | [Ver vídeo]    | —    |
| 2      | 📅 00/00/2026 | —     | [Ver Backlog](docs/sprint2.md#backlog)     | [Ver vídeo]    | —    |
| 3      | 📅 00/00/2026 | —     | [Ver Backlog](docs/sprint3.md#backlog)     | [Ver vídeo]    | —     |


</div>

**Legenda:**
- ✅ **Finalizada**
- 🚧 **Em Progresso**
- `—` **Não iniciado**

- # Objetivo das Sprints 📌 

# *Sprint 1 – :* 


# *Sprint 2 – :*


# *Sprint 3 – :*

[↑ Voltar ao topo](#topo)

<a id="backlogs"></a>
# Backlog do Produto 📌

## Legenda de Prioridade

| Prioridade | Uso no backlog |
| --- | --- |
| ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Itens obrigatorios para o MVP e para os requisitos centrais do desafio. |
| ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Itens importantes que ampliam a solucao, mas podem entrar apos o fluxo principal ficar estavel. |
| ![Prioridade Baixa](https://img.shields.io/badge/Prioridade-Baixa-green) | Itens complementares que agregam valor sem bloquear a demonstracao principal. |

## Backlog Funcional

Cada item abaixo relaciona a user story ao requisito funcional correspondente e resume o que precisa estar pronto antes de entrar em desenvolvimento e o que caracteriza a entrega concluida.

## Atendimento ao Usuario

### RF01 (US01) • O sistema deve permitir escolher o curso ou perfil logo no inicio do atendimento.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como aluno ou interessado externo, quero escolher meu curso ou perfil antes de iniciar a conversa, para que eu receba respostas adequadas ao meu contexto.
- **DoR:** Conteudo inicial por curso validado com a secretaria, mensagem de abertura aprovada e no raiz da conversa modelado no banco.
- **DoD:** Exibir as quatro opcoes iniciais, registrar a escolha do usuario e encaminhar corretamente para o fluxo correspondente.
- **Requisitos complementares:** Nao se aplica

### RF01 (US02) • O sistema deve permitir navegar por menus e submenus em formato de chatbot.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como usuario do autoatendimento, quero navegar por menus e submenus guiados, para que eu localize informacoes sem depender de atendimento humano imediato.
- **DoR:** Arvore de navegacao por curso mapeada, estrutura de nos e opcoes definida e comportamento de retorno planejado.
- **DoD:** Carregar menus a partir do banco, permitir navegacao hierarquica com voltar e encerrar cada ramo com a resposta esperada.
- **Requisitos complementares:** Nao se aplica

### RF01, RF02 (US03) • O sistema deve permitir consultas diretas no autoatendimento.

- **Prioridade:** ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)
- **User story:** Como usuario do autoatendimento, quero fazer consultas diretas quando eu ja souber o assunto desejado, para que eu encontre respostas com mais rapidez.
- **DoR:** Perguntas frequentes catalogadas, estrategia de busca definida e campo de consulta previsto na interface publica.
- **DoD:** Permitir a consulta direta, localizar respostas cadastradas quando houver aderencia e orientar o usuario quando a busca nao resolver o caso.
- **Requisitos complementares:** Nao se aplica

### RF01, RF02 (US04) • O sistema deve apresentar respostas resumidas, objetivas e padronizadas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como usuario do autoatendimento, quero receber respostas claras e padronizadas ao final de cada fluxo, para que eu entenda a orientacao sem ambiguidades.
- **DoR:** Textos oficiais validados com a secretaria, respostas resumidas aprovadas e relacao entre assunto, curso e resposta definida.
- **DoD:** Apresentar respostas padronizadas nos fluxos finais, mantendo linguagem objetiva e coerencia com o conteudo oficial do desafio.
- **Requisitos complementares:** RP05

### RF02 (US05) • O sistema deve exibir evidencias documentais vinculadas as respostas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como usuario do autoatendimento, quero visualizar o trecho documental que sustenta a resposta recebida, para que eu confie na orientacao fornecida pelo sistema.
- **DoR:** Documentos oficiais reunidos, trechos relevantes identificados e metadados de fonte mapeados para cada resposta aplicavel.
- **DoD:** Exibir evidencia documental com nome do arquivo, pagina e secao sempre que houver vinculo cadastrado para a resposta.
- **Requisitos complementares:** RP05

### RF05 (US10) • O sistema deve permitir encaminhar perguntas a Secretaria Academica.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como usuario do autoatendimento, quero enviar minha duvida para a secretaria quando o chatbot nao resolver meu problema, para que eu receba retorno humano sobre o caso.
- **DoR:** Campos da pergunta, e-mail, status inicial e ponto de encerramento do fluxo definidos para o atendimento publico.
- **DoD:** Exibir o formulario no fim do atendimento, salvar a duvida com os dados informados e confirmar o recebimento ao usuario.
- **Requisitos complementares:** Nao se aplica

### RF07 (US12) • O sistema deve permitir que o usuario avalie sua satisfacao com o atendimento.

- **Prioridade:** ![Prioridade Baixa](https://img.shields.io/badge/Prioridade-Baixa-green)
- **User story:** Como usuario do autoatendimento, quero registrar se gostei ou nao gostei da interacao, para que meu feedback fique registrado para a equipe.
- **DoR:** Opcoes de satisfacao definidas, relacionamento com o atendimento modelado e experiencia de encerramento planejada.
- **DoD:** Permitir uma unica avaliacao por interacao, registrar o feedback e retornar confirmacao de sucesso ao usuario.
- **Requisitos complementares:** Nao se aplica

## Perfis, Administracao Interna e Conteudo

### RF03 (US06) • O sistema deve contemplar os perfis de aluno, Secretaria Academica e administrador.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como equipe do projeto, quero ter perfis de acesso definidos para publico e area interna, para que cada usuario visualize apenas as funcionalidades compativeis com seu papel.
- **DoR:** Perfis do sistema definidos com a secretaria, matriz de acesso validada e rotas publicas e privadas mapeadas.
- **DoD:** Disponibilizar os tres perfis previstos no desafio, mantendo acesso publico para aluno e acesso autenticado para os perfis internos.
- **Requisitos complementares:** Nao se aplica

### RF04 (US07) • O sistema deve permitir ao administrador gerenciar menus, submenus e respostas do chatbot.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como administrador, quero criar, editar e excluir menus e respostas do autoatendimento, para que o conteudo do chatbot fique atualizado sem depender de alteracoes manuais no codigo.
- **DoR:** Regras de CRUD administrativo definidas, modelo de nos validado e tratamento de integridade de dados mapeado.
- **DoD:** Permitir ao administrador manter menus e respostas pelo painel interno, com persistencia correta e reflexo imediato na navegacao.
- **Requisitos complementares:** Nao se aplica

### RF02, RF04 (US08) • O sistema deve permitir ao administrador gerenciar documentos oficiais, chunks e metadados.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como administrador, quero cadastrar e manter documentos oficiais e seus trechos indexados, para que as evidencias do autoatendimento permaneçam atualizadas e rastreaveis.
- **DoR:** Tipos de documento, metadados obrigatorios e vinculo entre resposta e trecho definidos para o painel administrativo.
- **DoD:** Cadastrar, editar e remover documentos e trechos indexados, preservando o vinculo entre evidencia e resposta final.
- **Requisitos complementares:** Nao se aplica

### RF04 (US09) • O sistema deve permitir ao administrador gerenciar usuarios do perfil Secretaria Academica.

- **Prioridade:** ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)
- **User story:** Como administrador, quero cadastrar, editar e desativar usuarios da secretaria, para que o acesso ao painel interno fique sob controle institucional.
- **DoR:** Campos obrigatorios, politica de ativacao e fluxo de cadastro dos usuarios da secretaria definidos com antecedencia.
- **DoD:** Permitir a gestao de usuarios da secretaria com papel definido, persistencia correta e armazenamento seguro das senhas.
- **Requisitos complementares:** RNF09

## Secretaria e Rastreabilidade

### RF06 (US11) • O sistema deve permitir a Secretaria Academica listar e atualizar o status das perguntas recebidas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como secretaria academica, quero acompanhar as perguntas enviadas pelos usuarios e atualizar seus status, para que eu controle o andamento dos atendimentos internos.
- **DoR:** Painel interno da secretaria planejado, status permitidos definidos e regras de acesso validadas.
- **DoD:** Listar as duvidas recebidas, permitir a mudanca de status e persistir as atualizacoes com controle de acesso adequado.
- **Requisitos complementares:** Nao se aplica

### RF04, RF08 (US13) • O sistema deve registrar logs completos das interacoes e permitir sua consulta administrativa.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como administrador, quero consultar os registros das interacoes realizadas no autoatendimento, para que eu acompanhe o fluxo navegado, as duvidas enviadas e o feedback registrado.
- **DoR:** Eventos de log definidos, modelo de armazenamento criado e campos de consulta administrativa planejados para o painel.
- **DoD:** Registrar cada interacao com fluxo, pergunta, satisfacao e horario, mantendo os logs disponiveis para consulta administrativa.
- **Requisitos complementares:** Nao se aplica

## Seguranca e Controle de Acesso

### RF09, RF10, RF11 (US14) • O sistema deve autenticar usuarios internos, controlar acesso por papel e proteger as rotas administrativas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **User story:** Como secretaria academica ou administrador, quero fazer login com seguranca e acessar somente as funcionalidades autorizadas ao meu perfil, para que o painel interno fique protegido contra acessos indevidos.
- **DoR:** Fluxo de login definido, payload do JWT validado, regras de RBAC mapeadas e middlewares previstos para as rotas internas.
- **DoD:** Autenticar usuarios internos com login e senha, emitir JWT, validar token nas rotas administrativas e bloquear acessos indevidos por papel.
- **Requisitos complementares:** RNF08, RNF09, RP06

# Backlog Tecnico e de Entrega

Itens de sustentacao tecnica e academica que garantem aderencia as restricoes e aos requisitos nao funcionais.

### BT01 • Modelar o banco PostgreSQL e o repositorio de conhecimento com DDL e DML explicitos.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RP03, RNF03
- **Descricao:** Estruturar tabelas, relacionamentos e dados iniciais para nos de navegacao, respostas, documentos, chunks e metadados.
- **DoR:** Modelo de dados aprovado, entidades identificadas e scripts iniciais de banco planejados.
- **DoD:** Disponibilizar o esquema do PostgreSQL com DDL e DML aplicados e dados iniciais suficientes para sustentar o chatbot.

### BT02 • Construir o frontend em React com TypeScript com foco em clareza e responsividade.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RP01, RNF01
- **Descricao:** Implementar a interface publica e os paineis internos com adaptacao para navegadores e dispositivos moveis.
- **DoR:** Fluxos principais definidos, navegacao de telas planejada e padrao visual escolhido para o projeto.
- **DoD:** Executar o frontend em React com TypeScript, cobrindo desktop e mobile para os fluxos publicos e internos previstos.

### BT03 • Construir o backend HTTP em Node.js com TypeScript e documentar suas rotas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RP02, RNF03
- **Descricao:** Expor endpoints para autenticacao, navegacao, conteudo administrativo, perguntas, satisfacao e logs.
- **DoR:** Contrato das rotas definido, regras de negocio priorizadas e estrutura do projeto backend preparada.
- **DoD:** Disponibilizar a API em Node.js com TypeScript e documentar os endpoints necessarios para integracao com o frontend.

### BT04 • Containerizar a aplicacao completa e subir o ambiente com Docker Compose.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RNF05, RNF06, RP04
- **Descricao:** Executar PostgreSQL, backend e frontend exclusivamente por containers, com comando unico de inicializacao.
- **DoR:** Imagens e dependencias de cada servico definidas, variaveis de ambiente mapeadas e estrategia de orquestracao acordada.
- **DoD:** Subir PostgreSQL, backend e frontend com Docker Compose, mantendo a aplicacao funcional sem execucao local fora dos containers.

### BT05 • Produzir a documentacao do repositorio e os diagramas UML obrigatorios.

- **Prioridade:** ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)
- **Requisitos relacionados:** RNF04, RNF07
- **Descricao:** Manter README principal, READMEs por pasta e diagramas de casos de uso, classes, sequencia e componentes.
- **DoR:** Escopo consolidado, arquitetura definida e padrao de documentacao escolhido para o grupo.
- **DoD:** Entregar os READMEs atualizados e os diagramas UML obrigatorios de forma coerente com a implementacao realizada.

### BT06 • Aplicar seguranca operacional com JWT, hash de senha, expiracao de token e variaveis de ambiente.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RNF08, RNF09, RP06
- **Descricao:** Garantir uso de JWT no backend, bcrypt para senhas, expiracao de token e protecao de informacoes sensiveis.
- **DoR:** Chaves sensiveis separadas em ambiente, biblioteca de hash definida e politica de expiracao acordada.
- **DoD:** Usar JWT com expiracao, armazenar senhas com hash seguro e evitar exposicao de dados sensiveis nas respostas da API.

### BT07 • Validar desempenho de consultas e recuperacao de evidencias para uso interativo.

- **Prioridade:** ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)
- **Requisitos relacionados:** RNF02
- **Descricao:** Verificar tempo de resposta do backend, consultas ao banco e exibicao de trechos documentais nos principais fluxos do chatbot.
- **DoR:** Cenarios criticos de consulta definidos, pontos de medicao escolhidos e massa de dados minima disponivel para testes.
- **DoD:** Executar validacao de desempenho nos fluxos principais e registrar que o tempo de resposta ficou adequado ao uso interativo do sistema.



[↑ Voltar ao topo](#topo)

<a id="tecnologias"></a>
# Tecnologias Ultlizadas:

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" height="40" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" height="40" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" height="40" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" height="40" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" height="40" />
  <img src="https://img.shields.io/badge/Docker%20Compose-0B5FFF?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose" height="40" />
</p>


<a id="equipe"></a>

# Nossa Equipe 👩‍💻

A equipe **404 Not Found** é constituída de alunos do segundo semestre do curso de Desenvolvimento de Software Multiplataforma.

| Função        | Nome                          | Links |
|---------------|-------------------------------|-------|
| Project Owner | Luiza Gonçalves Manchini      | [GitHub](https://github.com/luiza-manchini) / [LinkedIn](https://www.linkedin.com/in/luiza-manchini-b51a7b336/) |
| Scrum Master  | Felipe Faria Machado          | [GitHub](https://github.com/felipefmac) / [LinkedIn](https://www.linkedin.com/in/felipefariamachado) |
| Dev Team      | Ariana Ferreira dos Santos    | [GitHub](https://github.com/arianaferresan) / [LinkedIn](https://br.linkedin.com/in/arianaferreira) |
| Dev Team      | Eloah Sousa da Silva          | [GitHub](https://github.com/eloahsousaa) / [LinkedIn](https://www.linkedin.com/in/eloah-sousa-650038349/) |
| Dev Team      | Lucas Monteiro Correia        | [GitHub](https://github.com/lucasmonteiro14) / [LinkedIn](https://www.linkedin.com/in/lucasmonteirocorreia)
| Dev Team      | Pedro Gonçalves Sampaio       | [GitHub](https://github.com/PedroSmp) / [LinkedIn](https://www.linkedin.com/in/pedro-sampaio-463a77375) |
| Dev Team      | William Max dos Santos Silva  | [GitHub](https://github.com/WilliamM4x) / [LinkedIn](https://www.linkedin.com/in/william-max-7b8036140/) |


[↑ Voltar ao topo](#topo)

