CREATE EXTENSION IF NOT EXISTS pgcrypto;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1
  FROM pg_type
  WHERE typname = 'user_role'
) THEN CREATE TYPE user_role AS ENUM ('admin', 'secretaria');
END IF;
IF NOT EXISTS (
  SELECT 1
  FROM pg_type
  WHERE typname = 'inquiry_status'
) THEN CREATE TYPE inquiry_status AS ENUM ('ABERTA', 'ATENDIMENTO', 'RESPONDIDA');
END IF;
IF NOT EXISTS (
  SELECT 1
  FROM pg_type
  WHERE typname = 'satisfaction_flag'
) THEN CREATE TYPE satisfaction_flag AS ENUM (
  'ÓTIMO',
  'BOM',
  'MUITO BOM',
  'SATISFATÓRIO',
  'RUIM'
);
END IF;
END;
$$;
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  name VARCHAR(150) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  troca_senha_obrigatoria BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Índice para login rápido por username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id SERIAL PRIMARY KEY,
  login_institucional VARCHAR(100) NOT NULL,
  usuario_id INT REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  data_solicitacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_atendimento TIMESTAMPTZ,
  admin_responsavel_id INT REFERENCES users(id) ON DELETE SET NULL,
  observacao TEXT,
  CONSTRAINT password_reset_requests_status_check CHECK (
    status IN ('pendente', 'atendida', 'cancelada')
  )
);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_status ON password_reset_requests(status);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_usuario_id ON password_reset_requests(usuario_id);
-- Tabela de nós da árvore 
CREATE TABLE IF NOT EXISTS navigation_nodes (
  id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES navigation_nodes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  chunk_path VARCHAR(500),
  link VARCHAR(500),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_navigation_parent_id ON navigation_nodes(parent_id);
CREATE INDEX idx_navigation_is_active ON navigation_nodes(is_active);

-- Tabela de logs e satisfação 
CREATE TABLE IF NOT EXISTS fulfillment_logs (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  navigation_flow JSONB NOT NULL DEFAULT '[]'::jsonb,
  inquiry_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  flag satisfaction_flag,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Suporte 
CREATE TABLE IF NOT EXISTS support_contacts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'ABERTA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  answered_by INT REFERENCES users(id) ON DELETE
  SET NULL
);
