export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Chatbot FAQtech Jacareí",
    version: "1.0.0",
    description: "Documentação das rotas de autoatendimento da FAQtech",
  },
  paths: {
    "/admin/nodes/all": {
      get: {
        tags: ["Admin"],
        summary: "Lista todos os nós (Menu) de forma linear",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": { description: "Lista retornada com sucesso" },
          "500": { description: "Erro interno no servidor" },
        },
      },
    },
    "/admin/nodes/create": {
      post: {
        tags: ["Admin"],
        summary: "Cria nó com upload de PDF opcional",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title"], // Adicionado para indicar que o título é obrigatório
                properties: {
                  parent_id: {
                    type: "integer",
                    nullable: true,
                    default: null,
                    description:
                      "ID do nó pai. Deixe vazio para nós raiz (DSM, Geo, etc)",
                  },
                  title: {
                    type: "string",
                    description: "Título/opção de clique do nó",
                  },
                  content: {
                    type: "string",
                    nullable: true,
                    default: null,
                    description: "Conteúdo da resposta",
                  },
                  file: {
                    type: "string",
                    format: "binary",
                    nullable: true,
                    description: "Arquivo PDF de evidência",
                  },
                  link: {
                    type: "string",
                    nullable: true,
                    default: null,
                    description: "URL externa (Opcional)",
                  },
                  display_order: { type: "integer", default: 0 },
                  is_active: { type: "boolean", default: true },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Nó criado com sucesso" },
          "500": { description: "Erro ao criar nó" },
        },
      },
    },
    "/admin/nodes/{id}": {
      put: {
        tags: ["Admin"],
        summary: "Atualiza um nó existente",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do nó a ser atualizado",
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  parent_id: {
                    type: "integer",
                    nullable: true,
                    default: null,
                    description: "ID do nó pai",
                  },
                  title: {
                    type: "string",
                    description: "Título/opção de clique do nó",
                  },
                  content: {
                    type: "string",
                    nullable: true,
                    default: null,
                    description: "Conteúdo da resposta",
                  },
                  file: {
                    type: "string",
                    format: "binary",
                    nullable: true,
                    description: "Arquivo PDF de evidência",
                  },
                  link: {
                    type: "string",
                    nullable: true,
                    default: null,
                    description: "URL externa (Opcional)",
                  },
                  display_order: { type: "integer", default: 0 },
                  is_active: { type: "boolean", default: true },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Nó atualizado com sucesso" },
          "404": { description: "Nó não encontrado" },
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Deleta um nó existente",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do nó a ser deletado",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": { description: "Nó deletado com sucesso (sem conteúdo)" },
          "500": { description: "Erro ao deletar nó" },
        },
      },
    },
    "/admin/nodes/filter/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Retorna a árvore completa de uma classe principal",
        description:
          "Usa uma query recursiva para buscar todos os filhos e netos de um nó raiz.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID da classe principal (ex: 1 para DSM)",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Árvore retornada com sucesso" },
          "404": {
            description: "Classe principal não encontrada ou sem ramos",
          },
        },
      },
    },
    "/api/options": {
      get: {
        tags: ["API Pública"],
        summary: "Inicia a navegação do chat",
        description:
          "Retorna o menu principal de opções para iniciar a conversa. Equivalente a chamar a rota com ID 0.",
        responses: {
          "200": {
            description:
              "Sucesso. Retorna { type: 'menu', options: [...] } com as opções raiz.",
          },
          "500": { description: "Erro interno ao processar navegação." },
        },
      },
    },
    "/api/options/{id}": {
      get: {
        tags: ["API Pública"],
        summary: "Continua a navegação do chat com um ID",
        description:
          "Retorna um menu de próximos botões ou a resposta final em formato de folha.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description:
              "ID do nó atual clicado pelo usuário. Use 0 para obter o menu inicial.",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description:
              "Sucesso. Pode retornar { type: 'menu', options: [...] } ou { type: 'answer', data: {...} }",
          },
          "400": {
            description: "O ID fornecido não é um número válido.",
          },
          "404": { description: "Conteúdo não encontrado" },
          "500": { description: "Erro interno ao processar navegação" },
        },
      },
    },
    "/api/perguntas": {
      post: {
        tags: ["API Pública"],
        summary: "Envia uma nova pergunta para a secretaria",
        description:
          "Permite que um usuário do chatbot envie uma dúvida para ser respondida pela secretaria. Corresponde à função createSupportContact.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "message"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    description: "E-mail do usuário para contato.",
                  },
                  message: {
                    type: "string",
                    description: "A dúvida do usuário.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Pergunta enviada com sucesso." },
          "400": {
            description: "Dados inválidos (e.g., email ou mensagem ausente).",
          },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/api/logs": {
      post: {
        tags: ["API Pública"],
        summary: "Cria um novo log de atendimento",
        description:
          "Registra o fluxo de navegação do usuário, as respostas consultadas e a avaliação de satisfação.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateFulfillmentLog",
              },
            },
          },
        },
        responses: {
          "201": { description: "Log criado com sucesso." },
          "400": { description: "Dados inválidos." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/admin/logs": {
      get: {
        tags: ["Admin - Logs"],
        summary: "Lista todos os logs de atendimento",
        security: [{ bearerAuth: [] }],
        description:
          "Retorna um histórico de todas as interações dos usuários com o chatbot.",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Número de registros a serem retornados (padrão: 20).",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            description:
              "Número de registros a pular para paginação (padrão: 0).",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Lista de logs retornada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FulfillmentLog" },
                },
              },
            },
          },
          "500": { description: "Erro ao buscar logs." },
        },
      },
    },
    "/admin/logs/stats": {
      get: {
        tags: ["Admin - Logs"],
        summary: "Retorna estatísticas de uso dos logs",
        security: [{ bearerAuth: [] }],
        description:
          "Agrupa os logs por mês e categoria (curso/perfil) para gerar estatísticas de uso do chatbot.",
        responses: {
          "200": {
            description: "Estatísticas retornadas com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      month: { type: "string", example: "2026-06" },
                      category: { type: "string", example: "DSM" },
                      log_count: { type: "integer", example: 42 },
                    },
                  },
                },
              },
            },
          },
          "500": { description: "Erro ao buscar estatísticas." },
        },
      },
    },
    "/admin/logs/inquiry-stats": {
      get: {
        tags: ["Admin - Logs"],
        summary: "Retorna a contagem de cada pergunta final acessada",
        security: [{ bearerAuth: [] }],
        description:
          "Analisa todos os logs, desagrega os IDs das perguntas (inquiry_ids) e retorna a contagem de quantas vezes cada ID foi acessado. Ideal para gerar histogramas de perguntas mais frequentes.",
        responses: {
          "200": {
            description: "Estatísticas retornadas com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      month: {
                        type: "string",
                        example: "2026-06",
                        description:
                          "Mês em que os acessos foram registrados (formato YYYY-MM).",
                      },
                      inquiry_id: {
                        type: "integer",
                        example: 15,
                        description: "ID da pergunta final (nó de resposta).",
                      },
                      title: {
                        type: "string",
                        example:
                          "Qual o horário de funcionamento da secretaria?",
                        description: "Título da pergunta final acessada.",
                      },
                      count: {
                        type: "integer",
                        example: 87,
                        description:
                          "Número de vezes que a pergunta foi acessada no mês.",
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { description: "Erro ao buscar estatísticas." },
        },
      },
    },
    "/admin/logs/inquiry-stats-leaf": {
      get: {
        tags: ["Admin - Logs"],
        summary:
          "Retorna a contagem de cada pergunta final (nó folha) acessada",
        security: [{ bearerAuth: [] }],
        description:
          "Analisa todos os logs, desagrega os IDs das perguntas e retorna a contagem de quantas vezes cada **nó folha (resposta final)** foi acessado. Ideal para gerar histogramas de perguntas mais frequentes.",
        responses: {
          "200": {
            description: "Estatísticas retornadas com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      month: {
                        type: "string",
                        example: "2026-06",
                        description:
                          "Mês em que os acessos foram registrados (formato YYYY-MM).",
                      },
                      inquiry_id: {
                        type: "integer",
                        example: 15,
                        description: "ID da pergunta final (nó de resposta).",
                      },
                      title: {
                        type: "string",
                        example:
                          "Qual o horário de funcionamento da secretaria?",
                        description: "Título da pergunta final acessada.",
                      },
                      count: {
                        type: "integer",
                        example: 87,
                        description:
                          "Número de vezes que a pergunta foi acessada no mês.",
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { description: "Erro ao buscar estatísticas." },
        },
      },
    },
    "/admin/perguntas": {
      get: {
        tags: ["Admin - Perguntas"],
        summary: "Lista todas as perguntas enviadas pelos usuários",
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "Retorna uma lista de todos os contatos de suporte (perguntas) para gerenciamento pela secretaria.",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Número de registros a serem retornados (padrão: 20).",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            description:
              "Número de registros a pular para paginação (padrão: 0).",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Lista de perguntas retornada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/SupportContact",
                  },
                },
              },
            },
          },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/admin/perguntas/stats": {
      get: {
        tags: ["Admin - Perguntas"],
        summary: "Retorna estatísticas de perguntas por status",
        security: [{ bearerAuth: [] }],
        description:
          "Agrupa as perguntas por status (ABERTA, ATENDIMENTO, RESPONDIDA) e retorna a contagem de cada um.",
        responses: {
          "200": {
            description: "Estatísticas retornadas com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        enum: ["ABERTA", "ATENDIMENTO", "RESPONDIDA"],
                        example: "ABERTA",
                      },
                      count: { type: "integer", example: 15 },
                    },
                  },
                },
              },
            },
          },
          "500": { description: "Erro ao buscar estatísticas." },
        },
      },
    },
    "/admin/perguntas/status/:status": {
      get: {
        tags: ["Admin - Perguntas"],
        summary: "Filtra perguntas por status",
        security: [{ bearerAuth: [] }],
        description:
          "Retorna uma lista de perguntas de suporte com base no status fornecido, com paginação.",
        parameters: [
          {
            name: "status",
            in: "path",
            required: true,
            description: "Status para filtrar as perguntas.",
            schema: {
              type: "string",
              enum: ["ABERTA", "ATENDIMENTO", "RESPONDIDA"],
            },
          },
          {
            name: "limit",
            in: "query",
            description: "Número de registros a serem retornados (padrão: 10).",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "offset",
            in: "query",
            description:
              "Número de registros a pular para paginação (padrão: 0).",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": { description: "Lista de perguntas retornada com sucesso." },
          "400": {
            description: "Parâmetros 'status', 'limit' ou 'offset' inválidos.",
          },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/admin/perguntas/{id}": {
      get: {
        tags: ["Admin - Perguntas"],
        summary: "Busca uma pergunta específica pelo ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Pergunta encontrada.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SupportContact" },
              },
            },
          },
          "404": { description: "Pergunta não encontrada." },
        },
      },
      delete: {
        tags: ["Admin - Perguntas"],
        summary: "Deleta uma pergunta",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": { description: "Pergunta deletada com sucesso." },
          "404": { description: "Pergunta não encontrada." },
        },
      },
      patch: {
        tags: ["Admin - Perguntas"],
        summary: "Atualiza o status de uma pergunta (TP05)",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["ABERTA", "ATENDIMENTO", "RESPONDIDA"],
                    description: "Novo status da pergunta.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Status atualizado com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SupportContact" },
              },
            },
          },
          "400": { description: "Dados inválidos." },
          "404": { description: "Pergunta não encontrada." },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Autentica um usuário e retorna um token JWT",
        description:
          "Realiza o login de um usuário com perfil 'admin' ou 'secretaria' e retorna um token de acesso.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginCredentials",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login bem-sucedido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          "401": { description: "Credenciais inválidas." },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Autenticação"],
        summary: "Retorna os dados do usuário autenticado",
        description:
          "Verifica o token JWT fornecido e retorna as informações do usuário logado (id, email, role).",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Usuário autenticado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "401": {
            description:
              "Não autenticado (token não fornecido, inválido ou expirado).",
          },
        },
      },
    },
    "/api/deve/deletall": {
      delete: {
        tags: ["DEV"],
        summary: "[DEV] Deleta todos os nós de navegação do banco de dados.",
        description:
          "Atenção: Esta rota executa um DELETE sem WHERE na tabela navigation_nodes. Uso exclusivo para ambiente de testes/desenvolvimento.",
        responses: {
          "200": {
            description: "Todos os registros foram apagados com sucesso.",
          },
          "500": {
            description: "Erro interno ao tentar limpar o banco.",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      FulfillmentLog: {
        type: "object",
        properties: {
          id: { type: "integer", description: "ID único do log." },
          session_id: {
            type: "string",
            format: "uuid",
            description: "ID da sessão do usuário.",
          },
          navigation_flow: {
            type: "array",
            items: { type: "object" },
            description: "Fluxo de navegação do usuário em formato JSON.",
          },
          inquiry_ids: {
            type: "array",
            items: { type: "integer" },
            description: "IDs das perguntas consultadas.",
          },
          flag: {
            type: "string",
            enum: ["ÓTIMO", "BOM", "MUITO BOM", "SATISFATÓRIO", "RUIM"],
            nullable: true,
            description: "Avaliação de satisfação do usuário.",
          },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreateFulfillmentLog: {
        type: "object",
        required: ["navigation_flow", "inquiry_ids", "flag"],
        properties: {
          navigation_flow: { type: "array", items: { type: "object" } },
          inquiry_ids: { type: "array", items: { type: "integer" } },
          flag: {
            type: "string",
            enum: ["ÓTIMO", "BOM", "MUITO BOM", "SATISFATÓRIO", "RUIM"],
          },
        },
        example: {
          navigation_flow: [
            { id: 1, title: "DSM" },
            { id: 5, title: "Horários" },
          ],
          inquiry_ids: [1, 5],
          flag: "ÓTIMO",
        },
      },
      SupportContact: {
        type: "object",
        properties: {
          id: { type: "integer", description: "ID único do contato." },
          email: {
            type: "string",
            format: "email",
            description: "E-mail do usuário que enviou a pergunta.",
          },
          message: { type: "string", description: "Conteúdo da pergunta." },
          status: {
            type: "string",
            enum: ["ABERTA", "ATENDIMENTO", "RESPONDIDA"],
            default: "ABERTA",
            description: "Status atual da pergunta.",
          },
          created_at: { type: "string", format: "date-time" },
          closed_at: { type: "string", format: "date-time", nullable: true },
          answered_by: {
            type: "integer",
            nullable: true,
            description: "ID do usuário que respondeu.",
          },
        },
      },
      LoginCredentials: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", description: "Username para login." },
          password: { type: "string", format: "password" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "Token JWT para ser usado nas rotas protegidas.",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          name: { type: "string" },
          role: {
            type: "string",
            enum: ["admin", "secretaria"],
            description: "Papel do usuário no sistema.",
          },
        },
      },
    },
  },
};
