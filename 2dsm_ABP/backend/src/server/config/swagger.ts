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
                  answered_by: {
                    type: "string",
                    description:
                      "Email do membro da secretaria que está respondendo.",
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
          answered_by: { type: "string", nullable: true },
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
