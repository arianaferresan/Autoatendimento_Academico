# Requisitos e User Stories 📋

Organizadas por area do produto, seguida da estrutura Como / Quero / Para.

## Atendimento ao Usuario

### US01 • O sistema deve permitir escolher o curso ou perfil logo no inicio do atendimento.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF01
- **Como:** aluno ou interessado externo
- **Quero:** escolher meu curso ou perfil antes de iniciar a conversa
- **Para que:** eu receba respostas adequadas ao meu contexto

**Criterios de aceitacao**

1. Ao acessar o sistema, o usuario deve visualizar a saudacao inicial e as opcoes DSM, Geoprocessamento, MARH e Nao sou aluno.
2. A opcao selecionada deve direcionar o usuario para a arvore de atendimento correta.
3. A escolha inicial deve ser registrada no contexto da sessao para uso no restante da navegacao.
4. O usuario deve conseguir reiniciar o atendimento e escolher outra opcao inicial sem recarregar o sistema.

### US02 • O sistema deve permitir navegar por menus e submenus em formato de chatbot.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF01
- **Como:** usuario do autoatendimento
- **Quero:** navegar por menus e submenus guiados
- **Para que:** eu localize informacoes sem depender de atendimento humano imediato

**Criterios de aceitacao**

1. Os menus e submenus devem ser carregados a partir dos dados cadastrados no banco de dados.
2. Cada escolha do usuario deve levar ao proximo no correto da arvore de navegacao.
3. O sistema deve permitir voltar para a etapa anterior e retornar ao menu inicial.
4. Quando o fluxo chegar a uma resposta final, o atendimento deve oferecer os proximos passos possiveis.

### US03 • O sistema deve permitir consultas diretas no autoatendimento.

- **Prioridade:** ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)
- **Requisitos relacionados:** RF01, RF02
- **Como:** usuario do autoatendimento
- **Quero:** fazer consultas diretas quando eu ja souber o assunto desejado
- **Para que:** eu encontre respostas com mais rapidez

**Criterios de aceitacao**

1. O sistema deve disponibilizar um campo de consulta direta alem da navegacao guiada.
2. A busca deve comparar a pergunta digitada com perguntas e respostas padronizadas do repositorio de conhecimento.
3. Quando houver correspondencia valida, o sistema deve exibir a resposta relacionada ao tema consultado.
4. Quando nao houver correspondencia suficiente, o sistema deve orientar o usuario a seguir pela navegacao guiada ou encaminhar a duvida a secretaria.

### US04 • O sistema deve apresentar respostas resumidas, objetivas e padronizadas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF01, RF02, RP05
- **Como:** usuario do autoatendimento
- **Quero:** receber respostas claras e padronizadas ao final de cada fluxo
- **Para que:** eu entenda a orientacao sem ambiguidades

**Criterios de aceitacao**

1. Ao final de cada fluxo, o sistema deve exibir uma resposta resumida em linguagem clara.
2. A resposta apresentada deve ser compativel com o conteudo oficial previamente cadastrado.
3. O texto nao deve expor termos internos do sistema nem informacoes tecnicas desnecessarias ao usuario final.
4. Quando houver evidencias cadastradas, a resposta deve manter o vinculo com a fonte correspondente.

### US05 • O sistema deve exibir evidencias documentais vinculadas as respostas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF02, RP05
- **Como:** usuario do autoatendimento
- **Quero:** visualizar o trecho documental que sustenta a resposta recebida
- **Para que:** eu confie na orientacao fornecida pelo sistema

**Criterios de aceitacao**

1. Quando houver evidencia aplicavel, o sistema deve mostrar o trecho do documento oficial relacionado a resposta.
2. A evidencia deve informar pelo menos nome do documento, pagina e secao ou ancora quando disponivel.
3. A evidencia exibida deve estar vinculada a resposta atualmente apresentada ao usuario.
4. Se uma resposta nao possuir evidencia cadastrada, o sistema nao deve inventar fonte nem trecho documental.

### US10 • O sistema deve permitir encaminhar perguntas a Secretaria Academica.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF05
- **Como:** usuario do autoatendimento
- **Quero:** enviar minha duvida para a secretaria quando o chatbot nao resolver meu problema
- **Para que:** eu receba retorno humano sobre o caso

**Criterios de aceitacao**

1. Ao final do atendimento, o sistema deve oferecer a opcao de enviar uma pergunta a secretaria.
2. O formulario deve solicitar texto da duvida e e-mail para resposta, orientando o uso do e-mail institucional.
3. A pergunta deve ser salva com status inicial Em aberto e com registro de data e hora.
4. Apos o envio, o usuario deve visualizar uma mensagem de confirmacao do recebimento da duvida.

### US12 • O sistema deve permitir que o usuario avalie sua satisfacao com o atendimento.

- **Prioridade:** ![Prioridade Baixa](https://img.shields.io/badge/Prioridade-Baixa-green)
- **Requisitos relacionados:** RF07
- **Como:** usuario do autoatendimento
- **Quero:** registrar se gostei ou nao gostei da interacao
- **Para que:** meu feedback fique registrado para a equipe

**Criterios de aceitacao**

1. Ao final do atendimento, o sistema deve disponibilizar as opcoes Gostei e Nao gostei.
2. O usuario deve conseguir registrar apenas uma avaliacao por interacao encerrada.
3. A avaliacao deve ser vinculada ao atendimento correspondente com data e hora.
4. Apos a avaliacao, o sistema deve confirmar que o feedback foi registrado.

## Perfis, Administracao Interna e Conteudo

### US06 • O sistema deve contemplar os perfis de aluno, Secretaria Academica e administrador.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF03
- **Como:** equipe do projeto
- **Quero:** ter perfis de acesso definidos para publico e area interna
- **Para que:** cada usuario visualize apenas as funcionalidades compativeis com seu papel

**Criterios de aceitacao**

1. O perfil Aluno deve permanecer com acesso publico, sem autenticacao.
2. Os perfis Secretaria Academica e Administrador devem existir como perfis autenticados no sistema.
3. As funcionalidades internas devem considerar o perfil do usuario autenticado.
4. A identificacao de perfil deve estar refletida no backend e na navegacao disponivel para cada papel.

### US07 • O sistema deve permitir ao administrador gerenciar menus, submenus e respostas do chatbot.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF04
- **Como:** administrador
- **Quero:** criar, editar e excluir menus e respostas do autoatendimento
- **Para que:** o conteudo do chatbot fique atualizado sem depender de alteracoes manuais no codigo

**Criterios de aceitacao**

1. O administrador autenticado deve conseguir criar, editar e excluir nos de navegacao e respostas finais.
2. As alteracoes devem ser persistidas no banco de dados e refletidas na navegacao do chatbot.
3. O sistema deve impedir acesso dessa funcionalidade a perfis que nao sejam administrador.
4. Ao excluir um no com dependencias, o sistema deve tratar a integridade dos dados antes de concluir a operacao.

### US08 • O sistema deve permitir ao administrador gerenciar documentos oficiais, chunks e metadados.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF02, RF04
- **Como:** administrador
- **Quero:** cadastrar e manter documentos oficiais e seus trechos indexados
- **Para que:** as evidencias do autoatendimento permaneçam atualizadas e rastreaveis

**Criterios de aceitacao**

1. O administrador deve conseguir cadastrar documentos oficiais com seus metadados relevantes.
2. O administrador deve conseguir associar trechos ou chunks as respostas cadastradas no sistema.
3. Deve ser possivel editar ou remover documentos e evidencias desatualizadas.
4. A relacao entre resposta, documento e metadados deve ser preservada para consulta posterior.

### US09 • O sistema deve permitir ao administrador gerenciar usuarios do perfil Secretaria Academica.

- **Prioridade:** ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow)
- **Requisitos relacionados:** RF04, RNF09
- **Como:** administrador
- **Quero:** cadastrar, editar e desativar usuarios da secretaria
- **Para que:** o acesso ao painel interno fique sob controle institucional

**Criterios de aceitacao**

1. O administrador deve conseguir cadastrar, editar e desativar usuarios do perfil secretaria.
2. Cada usuario interno deve possuir login, senha e papel definidos no sistema.
3. As senhas nao devem ser armazenadas em texto puro; devem usar hash seguro.
4. Usuarios sem papel de administrador nao devem acessar essa gestao.

## Secretaria e Rastreabilidade

### US11 • O sistema deve permitir a Secretaria Academica listar e atualizar o status das perguntas recebidas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF06
- **Como:** secretaria academica
- **Quero:** acompanhar as perguntas enviadas pelos usuarios e atualizar seus status
- **Para que:** eu controle o andamento dos atendimentos internos

**Criterios de aceitacao**

1. A secretaria autenticada deve conseguir acessar a lista de perguntas enviadas pelos usuarios.
2. A listagem deve exibir pelo menos texto da duvida, e-mail informado, status e data e hora de envio.
3. A secretaria deve conseguir alterar o status para Em aberto, Em atendimento ou Respondida.
4. Usuarios nao autenticados ou sem papel de secretaria nao devem acessar essa funcionalidade.

### US13 • O sistema deve registrar logs completos das interacoes e permitir sua consulta administrativa.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF04, RF08
- **Como:** administrador
- **Quero:** consultar os registros das interacoes realizadas no autoatendimento
- **Para que:** eu acompanhe o fluxo navegado, as duvidas enviadas e o feedback registrado

**Criterios de aceitacao**

1. O sistema deve registrar o fluxo completo de navegacao realizado em cada atendimento.
2. O log deve armazenar perguntas enviadas a secretaria, registro de satisfacao e data e hora da interacao.
3. Os registros devem ser persistidos sem expor dados sensiveis como senha ou token.
4. Quando a funcionalidade administrativa estiver disponivel, o administrador deve conseguir consultar os logs de navegacao.

## Seguranca e Controle de Acesso

### US14 • O sistema deve autenticar usuarios internos, controlar acesso por papel e proteger as rotas administrativas.

- **Prioridade:** ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red)
- **Requisitos relacionados:** RF09, RF10, RF11, RNF08, RNF09, RP06
- **Como:** secretaria academica ou administrador
- **Quero:** fazer login com seguranca e acessar somente as funcionalidades autorizadas ao meu perfil
- **Para que:** o painel interno fique protegido contra acessos indevidos

**Criterios de aceitacao**

1. Ao informar credenciais validas, o usuario interno deve receber autenticacao bem-sucedida no backend.
2. A autenticacao deve gerar JWT contendo identificador do usuario, papel e tempo de expiracao.
3. Rotas administrativas devem exigir token valido e papel apropriado antes de liberar acesso.
4. Requisicoes sem autenticacao ou com papel inadequado devem retornar erro apropriado sem expor informacoes sensiveis.
