# Definition of Done (DoD)

## Como usar este anexo

Este anexo resume o que caracteriza a conclusão de cada item do backlog. Ele serve como referência de aceite rápido e deve ser lido junto do backlog principal.

## Itens Funcionais

| US / RF | Prioridade | Done resumido |
| --- | --- | --- |
| US01 / RF01 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Exibir as quatro opções iniciais, registrar a escolha do usuário e encaminhar corretamente para o fluxo correspondente. |
| US02 / RF01 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Carregar menus a partir do banco, permitir navegação hierárquica com voltar e encerrar cada ramo com a resposta esperada. |
| US03 / RF01, RF02 | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Permitir a consulta direta, localizar respostas cadastradas quando houver aderência e orientar o usuário quando a busca não resolver o caso. |
| US04 / RF01, RF02 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Apresentar respostas padronizadas nos fluxos finais, mantendo linguagem objetiva e coerência com o conteúdo oficial do desafio. |
| US05 / RF02 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Exibir evidência documental com nome do arquivo, página e seção sempre que houver vínculo cadastrado para a resposta. |
| US10 / RF05 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Exibir o formulário no fim do atendimento, salvar a dúvida com os dados informados e confirmar o recebimento ao usuário. |
| US12 / RF07 | ![Prioridade Baixa](https://img.shields.io/badge/Prioridade-Baixa-green) | Permitir uma única avaliação por interação, registrar o feedback e retornar confirmação de sucesso ao usuário. |
| US06 / RF03 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Disponibilizar os três perfis previstos no desafio, mantendo acesso público para aluno e acesso autenticado para os perfis internos. |
| US07 / RF04 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Permitir ao administrador manter menus e respostas pelo painel interno, com persistência correta e reflexo imediato na navegação. |
| US08 / RF02, RF04 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Cadastrar, editar e remover documentos e trechos indexados, preservando o vínculo entre evidência e resposta final. |
| US09 / RF04 | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Permitir a gestão de usuários da secretaria com papel definido, persistência correta e armazenamento seguro das senhas. |
| US11 / RF06 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Listar as dúvidas recebidas, permitir a mudança de status e persistir as atualizações com controle de acesso adequado. |
| US13 / RF04, RF08 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Registrar cada interação com fluxo, pergunta, satisfação e horário, mantendo os logs disponíveis para consulta administrativa. |
| US14 / RF09, RF10, RF11 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Autenticar usuários internos com login e senha, emitir JWT, validar token nas rotas administrativas e bloquear acessos indevidos por papel. |

## Itens Técnicos e de Entrega

| Item | Prioridade | Done resumido |
| --- | --- | --- |
| BT01 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Disponibilizar o esquema do PostgreSQL com DDL e DML aplicados e dados iniciais suficientes para sustentar o chatbot. |
| BT02 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Executar o frontend em React com TypeScript, cobrindo desktop e mobile para os fluxos públicos e internos previstos. |
| BT03 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Disponibilizar a API em Node.js com TypeScript e documentar os endpoints necessários para integração com o frontend. |
| BT04 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Subir PostgreSQL, backend e frontend com Docker Compose, mantendo a aplicação funcional sem execução local fora dos containers. |
| BT05 | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Entregar os READMEs atualizados e os diagramas UML obrigatórios de forma coerente com a implementação realizada. |
| BT06 | ![Prioridade Alta](https://img.shields.io/badge/Prioridade-Alta-red) | Usar JWT com expiração, armazenar senhas com hash seguro e evitar exposição de dados sensíveis nas respostas da API. |
| BT07 | ![Prioridade Media](https://img.shields.io/badge/Prioridade-Media-yellow) | Executar validação de desempenho nos fluxos principais e registrar que o tempo de resposta ficou adequado ao uso interativo do sistema. |
