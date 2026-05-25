-- DDL: criação da tabela de usuários
CREATE TYPE user_role AS ENUM ('admin', 'secretaria');

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT       NOT NULL,
  role        user_role    NOT NULL,
  name        VARCHAR(150) NOT NULL,
  active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Índice para login rápido por username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
