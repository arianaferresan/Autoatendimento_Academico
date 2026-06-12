import { pool } from "@/server/config/database.js";
import type {
  PasswordResetRequestRow,
  PasswordResetRequestStatus,
  PasswordResetTokenRow,
  UserRow,
} from "../types/types.js";

let authSchemaReady = false;

export async function ensureAuthSchema(): Promise<void> {
  if (authSchemaReady) {
    return;
  }

  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS troca_senha_obrigatoria BOOLEAN NOT NULL DEFAULT FALSE
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash
      ON password_reset_tokens(token_hash)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
      ON password_reset_tokens(user_id)
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_requests (
      id SERIAL PRIMARY KEY,
      login_institucional VARCHAR(100) NOT NULL,
      usuario_id INT REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pendente',
      data_solicitacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data_atendimento TIMESTAMPTZ,
      admin_responsavel_id INT REFERENCES users(id) ON DELETE SET NULL,
      observacao TEXT,
      CONSTRAINT password_reset_requests_status_check
        CHECK (status IN ('pendente', 'atendida', 'cancelada'))
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_password_reset_requests_status
      ON password_reset_requests(status)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_password_reset_requests_usuario_id
      ON password_reset_requests(usuario_id)
  `);

  authSchemaReady = true;
}

export async function findUserByUsername(
  username: string,
): Promise<UserRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE username = $1 AND active = TRUE",
    [username.trim().toLowerCase()],
  );
  return result.rows[0] ?? null;
}

export async function findUserForPasswordReset(
  username: string,
): Promise<Pick<UserRow, "id" | "username" | "name" | "active"> | null> {
  await ensureAuthSchema();
  const result = await pool.query<Pick<UserRow, "id" | "username" | "name" | "active">>(
    `SELECT id, username, name, active
       FROM users
      WHERE username = $1 AND active = TRUE`,
    [username.trim().toLowerCase()],
  );
  return result.rows[0] ?? null;
}

export async function createPasswordResetToken(
  userId: number,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await ensureAuthSchema();
  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt],
  );
}

export async function invalidateUnusedPasswordResetTokens(userId: number): Promise<void> {
  await ensureAuthSchema();
  await pool.query(
    `UPDATE password_reset_tokens
        SET used_at = NOW()
      WHERE user_id = $1
        AND used_at IS NULL`,
    [userId],
  );
}

export async function findValidPasswordResetToken(
  tokenHash: string,
): Promise<(PasswordResetTokenRow & { user_active: boolean }) | null> {
  await ensureAuthSchema();
  const result = await pool.query<PasswordResetTokenRow & { user_active: boolean }>(
    `SELECT prt.*, u.active AS user_active
       FROM password_reset_tokens prt
       JOIN users u ON u.id = prt.user_id
      WHERE prt.token_hash = $1
        AND prt.used_at IS NULL
        AND prt.expires_at > NOW()
        AND u.active = TRUE`,
    [tokenHash],
  );
  return result.rows[0] ?? null;
}

export async function markPasswordResetTokenUsed(tokenId: number): Promise<void> {
  await ensureAuthSchema();
  await pool.query(
    `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`,
    [tokenId],
  );
}

export async function updatePasswordAfterReset(
  userId: number,
  passwordHash: string,
): Promise<void> {
  await ensureAuthSchema();
  await pool.query(
    `UPDATE users
        SET password_hash = $1,
            troca_senha_obrigatoria = FALSE
      WHERE id = $2`,
    [passwordHash, userId],
  );
}

export async function createPasswordResetRequest(
  loginInstitucional: string,
  userId: number | null,
): Promise<void> {
  await ensureAuthSchema();
  await pool.query(
    `INSERT INTO password_reset_requests (login_institucional, usuario_id)
     VALUES ($1, $2)`,
    [loginInstitucional.trim().toLowerCase(), userId],
  );
}

export async function listPasswordResetRequests(
  status?: PasswordResetRequestStatus,
): Promise<PasswordResetRequestRow[]> {
  await ensureAuthSchema();
  const params: string[] = [];
  const where = status ? "WHERE prr.status = $1" : "";
  if (status) {
    params.push(status);
  }

  const result = await pool.query<PasswordResetRequestRow>(
    `SELECT
        prr.id,
        prr.login_institucional,
        prr.usuario_id,
        prr.status::text AS status,
        prr.data_solicitacao,
        prr.data_atendimento,
        prr.admin_responsavel_id,
        prr.observacao,
        u.name AS user_name,
        u.active AS user_active,
        admin.name AS admin_name
       FROM password_reset_requests prr
       LEFT JOIN users u ON u.id = prr.usuario_id
       LEFT JOIN users admin ON admin.id = prr.admin_responsavel_id
       ${where}
       ORDER BY
        CASE prr.status WHEN 'pendente' THEN 0 WHEN 'atendida' THEN 1 ELSE 2 END,
        prr.data_solicitacao DESC`,
    params,
  );
  return result.rows;
}

export async function getPasswordResetRequestById(
  id: number,
): Promise<PasswordResetRequestRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<PasswordResetRequestRow>(
    `SELECT
        id,
        login_institucional,
        usuario_id,
        status::text AS status,
        data_solicitacao,
        data_atendimento,
        admin_responsavel_id,
        observacao
       FROM password_reset_requests
      WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function resolvePasswordResetRequest(
  requestId: number,
  adminId: number,
  passwordHash: string,
): Promise<PasswordResetRequestRow | null> {
  await ensureAuthSchema();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const requestResult = await client.query<PasswordResetRequestRow>(
      `SELECT id, usuario_id, status::text AS status
         FROM password_reset_requests
        WHERE id = $1
        FOR UPDATE`,
      [requestId],
    );
    const request = requestResult.rows[0];
    if (!request || request.status !== "pendente" || request.usuario_id === null) {
      await client.query("ROLLBACK");
      return null;
    }

    const passwordUpdate = await client.query(
      `UPDATE users
          SET password_hash = $1,
              troca_senha_obrigatoria = TRUE
        WHERE id = $2 AND active = TRUE`,
      [passwordHash, request.usuario_id],
    );

    if ((passwordUpdate.rowCount ?? 0) === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const updated = await client.query<PasswordResetRequestRow>(
      `UPDATE password_reset_requests
          SET status = 'atendida',
              data_atendimento = NOW(),
              admin_responsavel_id = $2
        WHERE id = $1
        RETURNING id, login_institucional, usuario_id, status::text AS status,
                  data_solicitacao, data_atendimento, admin_responsavel_id,
                  observacao`,
      [requestId, adminId],
    );

    await client.query("COMMIT");
    return updated.rows[0] ?? null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function cancelPasswordResetRequest(
  requestId: number,
  adminId: number,
  observacao: string | null,
): Promise<PasswordResetRequestRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<PasswordResetRequestRow>(
    `UPDATE password_reset_requests
        SET status = 'cancelada',
            data_atendimento = NOW(),
            admin_responsavel_id = $2,
            observacao = $3
      WHERE id = $1 AND status = 'pendente'
      RETURNING id, login_institucional, usuario_id, status::text AS status,
                data_solicitacao, data_atendimento, admin_responsavel_id,
                observacao`,
    [requestId, adminId, observacao],
  );
  return result.rows[0] ?? null;
}
