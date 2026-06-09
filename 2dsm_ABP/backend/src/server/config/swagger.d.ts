export declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    paths: {
        "/admin/nodes/all": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/nodes/create": {
            post: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    parent_id: {
                                        type: string;
                                        nullable: boolean;
                                        default: null;
                                        description: string;
                                    };
                                    title: {
                                        type: string;
                                        description: string;
                                    };
                                    content: {
                                        type: string;
                                        nullable: boolean;
                                        default: null;
                                        description: string;
                                    };
                                    file: {
                                        type: string;
                                        format: string;
                                        nullable: boolean;
                                        description: string;
                                    };
                                    link: {
                                        type: string;
                                        nullable: boolean;
                                        default: null;
                                        description: string;
                                    };
                                    display_order: {
                                        type: string;
                                        default: number;
                                    };
                                    is_active: {
                                        type: string;
                                        default: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/nodes/{id}": {
            put: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: string;
                                properties: {
                                    parent_id: {
                                        type: string;
                                        nullable: boolean;
                                        default: null;
                                        description: string;
                                    };
                                    title: {
                                        type: string;
                                        description: string;
                                    };
                                    content: {
                                        type: string;
                                        nullable: boolean;
                                        default: null;
                                        description: string;
                                    };
                                    file: {
                                        type: string;
                                        format: string;
                                        nullable: boolean;
                                        description: string;
                                    };
                                    link: {
                                        type: string;
                                        nullable: boolean;
                                        default: null;
                                        description: string;
                                    };
                                    display_order: {
                                        type: string;
                                        default: number;
                                    };
                                    is_active: {
                                        type: string;
                                        default: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "204": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/nodes/filter/{id}": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
        };
        "/api/options": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/api/options/{id}": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/api/perguntas": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                    message: {
                                        type: string;
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/api/logs": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/logs": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/logs/stats": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            month: {
                                                type: string;
                                                example: string;
                                            };
                                            category: {
                                                type: string;
                                                example: string;
                                            };
                                            log_count: {
                                                type: string;
                                                example: number;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/logs/inquiry-stats": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            month: {
                                                type: string;
                                                example: string;
                                                description: string;
                                            };
                                            inquiry_id: {
                                                type: string;
                                                example: number;
                                                description: string;
                                            };
                                            title: {
                                                type: string;
                                                example: string;
                                                description: string;
                                            };
                                            count: {
                                                type: string;
                                                example: number;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/logs/inquiry-stats-leaf": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            month: {
                                                type: string;
                                                example: string;
                                                description: string;
                                            };
                                            inquiry_id: {
                                                type: string;
                                                example: number;
                                                description: string;
                                            };
                                            title: {
                                                type: string;
                                                example: string;
                                                description: string;
                                            };
                                            count: {
                                                type: string;
                                                example: number;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/perguntas": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/perguntas/stats": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            status: {
                                                type: string;
                                                enum: string[];
                                                example: string;
                                            };
                                            count: {
                                                type: string;
                                                example: number;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/perguntas/status/:status": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    description: string;
                    schema: {
                        type: string;
                        enum: string[];
                        default?: never;
                    };
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        type: string;
                        default: number;
                        enum?: never;
                    };
                    required?: never;
                })[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
        "/admin/perguntas/{id}": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "404": {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "204": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
            patch: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    status: {
                                        type: string;
                                        enum: string[];
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
        };
        "/auth/login": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
        "/auth/me": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
        "/api/deve/deletall": {
            delete: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    "200": {
                        description: string;
                    };
                    "500": {
                        description: string;
                    };
                };
            };
        };
    };
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            FulfillmentLog: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    session_id: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    navigation_flow: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                    inquiry_ids: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                    flag: {
                        type: string;
                        enum: string[];
                        nullable: boolean;
                        description: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateFulfillmentLog: {
                type: string;
                required: string[];
                properties: {
                    navigation_flow: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    inquiry_ids: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    flag: {
                        type: string;
                        enum: string[];
                    };
                };
                example: {
                    navigation_flow: {
                        id: number;
                        title: string;
                    }[];
                    inquiry_ids: number[];
                    flag: string;
                };
            };
            SupportContact: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    email: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    message: {
                        type: string;
                        description: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        default: string;
                        description: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                    closed_at: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    answered_by: {
                        type: string;
                        nullable: boolean;
                        description: string;
                    };
                };
            };
            LoginCredentials: {
                type: string;
                required: string[];
                properties: {
                    username: {
                        type: string;
                        description: string;
                    };
                    password: {
                        type: string;
                        format: string;
                    };
                };
            };
            LoginResponse: {
                type: string;
                properties: {
                    token: {
                        type: string;
                        description: string;
                    };
                };
            };
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    username: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    role: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=swagger.d.ts.map