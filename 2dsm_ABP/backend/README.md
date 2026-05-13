# Backend — Autenticação JWT

> Node.js + TypeScript + PostgreSQL + JWT  
> Projeto ABP 2026-1 — Fatec Jacareí

---

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

---

## Instalação

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais do banco
```

---

## Banco de dados

```bash
# Cria o banco (se ainda não existir)
createdb fatec_auth

# Executa DDL (cria a tabela users)
npm run db:migrate

# Executa seed (insere admin e secretaria de teste)
npm run db:seed
```

**Usuários criados pelo seed:**

| username    | senha          | role       |
|-------------|----------------|------------|
| admin       | admin123       | admin      |
| secretaria  | secretaria123  | secretaria |

> ⚠️ Troque as senhas em produção usando o utilitário:
> ```bash
> npx ts-node src/utils/hashPassword.ts novasenha
> ```

---

## Executar em desenvolvimento

```bash
npm run dev
# Servidor em http://localhost:3001
```

---

## Endpoints

### POST `/auth/login`
Autentica o usuário e retorna o JWT.

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "name": "Administrador"
  }
}
```

---

### GET `/auth/me`
Retorna os dados do usuário autenticado.

**Header:** `Authorization: Bearer <token>`

**Resposta 200:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "name": "Administrador"
  }
}
```

---

### GET `/admin/perguntas`
Lista perguntas. Requer role: `admin` ou `secretaria`.

### PATCH `/admin/perguntas/:id/status`
Atualiza status de uma pergunta. Requer role: `admin` ou `secretaria`.

### GET `/admin/usuarios`
Lista usuários. Requer role: `admin`.

### POST `/admin/usuarios`
Cria usuário. Requer role: `admin`.

### GET `/admin/logs`
Visualiza logs. Requer role: `admin`.

---

## Erros de autenticação

| Status | Mensagem                          | Causa                        |
|--------|-----------------------------------|------------------------------|
| 400    | username e password são obrigatórios | Body incompleto           |
| 401    | Credenciais inválidas             | Usuário não existe ou senha errada |
| 401    | Token não fornecido               | Header Authorization ausente |
| 401    | Token expirado                    | Token venceu (8h)            |
| 401    | Token inválido                    | Token adulterado             |
| 403    | Acesso negado                     | Role sem permissão           |

---

## Uso do middleware em novas rotas

```typescript
import { authMiddleware, authorize } from '../middlewares/authMiddleware';

// Qualquer usuário autenticado
router.get('/rota', authMiddleware, handler);

// Apenas admin
router.post('/rota', authMiddleware, authorize('admin'), handler);

// Admin ou secretaria
router.get('/rota', authMiddleware, authorize('admin', 'secretaria'), handler);
```
