import { pool } from "@/server/config/database.js";

import type {
  Node,
  SupportContact,
  FullfillmentLog,
  LogStat,
  SupportContactStat,
  InquiryStat,
  SatisfactionStat,
} from "@/types/typesAdmin.js";

import type { UserRow } from "@/types/types.js";
import type { UserRole } from "@/types/types.js";
import { ensureAuthSchema } from "@/repos/authRepository.js";

async function searchAllNodes(): Promise<Node[]> {
  const result = await pool.query<Node>(
    `SELECT id, parent_id, title, content, display_order, chunk_path, link, is_active, created_at, updated_at 
            FROM navigation_nodes 
            ORDER BY parent_id NULLS FIRST, display_order ASC, title ASC`,
  );
  return result.rows;
}

async function searchNodeById(id: number): Promise<Node[]> {
  const query = `
        WITH RECURSIVE tree_view AS (
            -- Parte Inicial: O curso selecionado
            SELECT id, parent_id, title, content, chunk_path, link, 1 AS nivel
            FROM navigation_nodes
            WHERE id = $1 AND parent_id IS NULL
            
            UNION ALL
            
            -- Parte Recursiva: Os filhos deste curso
            SELECT n.id, n.parent_id, n.title, n.content, n.chunk_path, n.link, tv.nivel + 1
            FROM navigation_nodes n
            INNER JOIN tree_view tv ON n.parent_id = tv.id
        )
        SELECT * FROM tree_view ORDER BY nivel ASC, id ASC;`;
  const result = await pool.query<Node>(query, [id]);
  return result.rows;
}

async function findNodeById(id: number): Promise<Node | undefined> {
  const result = await pool.query<Node>(
    "SELECT * FROM navigation_nodes WHERE id = $1",
    [id],
  );
  return result.rows[0];
}

async function isNodeDescendant(
  nodeId: number,
  possibleDescendantId: number,
): Promise<boolean> {
  const result = await pool.query<{ exists: boolean }>(
    `
    WITH RECURSIVE descendants AS (
      SELECT id FROM navigation_nodes WHERE parent_id = $1
      UNION ALL
      SELECT n.id
        FROM navigation_nodes n
        JOIN descendants d ON n.parent_id = d.id
    )
    SELECT EXISTS (
      SELECT 1 FROM descendants WHERE id = $2
    ) AS exists
    `,
    [nodeId, possibleDescendantId],
  );

  return Boolean(result.rows[0]?.exists);
}

// Pensar neste delete recursive ou não ser recurssivo
//'DELETE FROM navigation_nodes WHERE id = $1', [id]
async function deleteNodeById(id: number): Promise<void> {
  const query = `
        WITH RECURSIVE to_delete AS (
            SELECT id FROM navigation_nodes WHERE id = $1
            UNION ALL
            SELECT n.id FROM navigation_nodes n INNER JOIN to_delete td ON n.parent_id = td.id
        )
        DELETE FROM navigation_nodes WHERE id IN (SELECT id FROM to_delete);
    `;
  await pool.query(query, [id]);
}

async function updateNodeById(
  id: number,
  parent_id: number | null,
  title: string,
  content: string | null,
  display_order: number,
  link: string | null,
  is_active: boolean,
  chunk_path: string | null,
): Promise<Node | undefined> {
  const query = `
            UPDATE navigation_nodes 
            SET parent_id = $1, title = $2, content = $3, display_order = $4, chunk_path = $5, link = $6, is_active = $7, updated_at = NOW() 
            WHERE id = $8
            RETURNING *`;

  const values = [
    parent_id,
    title,
    content,
    display_order,
    chunk_path,
    link,
    is_active,
    id,
  ];

  const result = await pool.query<Node>(query, values);
  return result.rows[0];
}

async function createNode(
  parent_id: number | null,
  title: string,
  content: string | null,
  display_order: number,
  link: string | null,
  is_active: boolean,
  chunk_path: string | null,
): Promise<Node | undefined> {
  const query = `
    INSERT INTO navigation_nodes 
    (parent_id, title, content, display_order, chunk_path, link, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *`;

  const values = [
    parent_id,
    title,
    content,
    display_order,
    chunk_path,
    link,
    is_active,
  ];

  const result = await pool.query<Node>(query, values);
  return result.rows[0];
}

// Repos para suporte - FUNÇÂO

async function getSupportContactById(
  id: number,
): Promise<SupportContact | undefined> {
  const result = await pool.query<SupportContact>(
    `SELECT sc.id, sc.email, sc.message, sc.status, sc.created_at, sc.closed_at, sc.answered_by, u.name AS answered_by_name
       FROM support_contacts sc
       LEFT JOIN users u ON u.id = sc.answered_by
      WHERE sc.id = $1`,
    [id],
  );
  return result.rows[0];
}

async function getSupportContactAll(
  limit: number,
  offset: number,
): Promise<SupportContact[]> {
  const result = await pool.query<SupportContact>(
    `SELECT sc.id, sc.email, sc.message, sc.status, sc.created_at, sc.closed_at, sc.answered_by, u.name AS answered_by_name
       FROM support_contacts sc
       LEFT JOIN users u ON u.id = sc.answered_by
      ORDER BY sc.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return result.rows;
}

async function updateSupportContactById(
  id: number,
  status: SupportContact["status"],
  answered_by: number | null,
): Promise<SupportContact | undefined> {
  const result = await pool.query<SupportContact>(
    `
  UPDATE support_contacts 
  SET status = $2::inquiry_status,
      answered_by = CASE WHEN $2::inquiry_status = 'RESPONDIDA' THEN $3::int ELSE NULL END,
      closed_at = CASE WHEN $2::inquiry_status = 'RESPONDIDA' THEN NOW() ELSE NULL END
  WHERE id = $1
  RETURNING *,
    (SELECT name FROM users WHERE id = support_contacts.answered_by) AS answered_by_name`,
    [id, status, answered_by],
  );
  return result.rows[0];
}

async function getSupportContactByStatus(
  status: SupportContact["status"],
  limit: number,
  offset: number,
): Promise<SupportContact[]> {
  const result = await pool.query<SupportContact>(
    `SELECT sc.id, sc.email, sc.message, sc.status, sc.created_at, sc.closed_at, sc.answered_by, u.name AS answered_by_name
     FROM support_contacts sc
     LEFT JOIN users u ON u.id = sc.answered_by
     WHERE sc.status = $1 
     ORDER BY sc.created_at DESC LIMIT $2 OFFSET $3`,
    [status, limit, offset],
  );
  return result.rows;
}
async function getSupportContactStats(): Promise<SupportContactStat[]> {
  const result = await pool.query<SupportContactStat>(
    `SELECT status, COUNT(*)::int AS count 
     FROM support_contacts 
     GROUP BY status`,
  );
  return result.rows;
}

async function getInquiryStats(): Promise<InquiryStat[]> {
  const query = `
    SELECT
        TO_CHAR(fl.created_at, 'YYYY-MM') AS month,
        (id_text)::int AS inquiry_id,
        nn.title,
        COUNT(*)::int AS count
    FROM
        fulfillment_logs fl,
        jsonb_array_elements_text(fl.inquiry_ids) AS id_text
    JOIN
        navigation_nodes nn ON (id_text)::int = nn.id
    WHERE
        jsonb_array_length(fl.inquiry_ids) > 0
    GROUP BY
        month,
        inquiry_id,
        nn.title
    ORDER BY
        month DESC, count DESC;
  `;
  const { rows } = await pool.query<InquiryStat>(query);
  return rows;
}

async function getInquiryStatsLeaf(): Promise<InquiryStat[]> {
  const query = `
    SELECT
        TO_CHAR(fl.created_at, 'YYYY-MM') AS month,
        (id_text)::int AS inquiry_id,
        nn.title,
        COUNT(*)::int AS count
    FROM
        fulfillment_logs fl,
        jsonb_array_elements_text(fl.inquiry_ids) AS id_text
    JOIN
        navigation_nodes nn ON (id_text)::int = nn.id
    WHERE
        jsonb_array_length(fl.inquiry_ids) > 0 AND
        NOT EXISTS (SELECT 1 FROM navigation_nodes child WHERE child.parent_id = nn.id)
    GROUP BY
        month,
        inquiry_id,
        nn.title
    ORDER BY
        month DESC, count DESC;
  `;
  const { rows } = await pool.query<InquiryStat>(query);
  return rows;
}

//Melhorar essa função - FUNÇÂO
async function deleteSupportContactById(id: number): Promise<void> {
  await pool.query(
    `
    DELETE FROM support_contacts 
    WHERE id = $1`,
    [id],
  );
}

async function createFulfillmentLog(
  data: Omit<FullfillmentLog, "id" | "session_id" | "created_at">,
): Promise<void> {
  await pool.query(
    `INSERT INTO fulfillment_logs ( navigation_flow, inquiry_ids, flag) VALUES ($1, $2, $3)`,
    [
      JSON.stringify(data.navigation_flow),
      JSON.stringify(data.inquiry_ids),
      data.flag,
    ],
  );
}

async function getAllSecretariaUsers(): Promise<UserRow[]> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `SELECT id, username, role, name, active, troca_senha_obrigatoria, created_at FROM users ORDER BY name ASC`,
  );
  return result.rows;
}

async function createSecretariaUser(
  username: string,
  password_hash: string,
  name: string,
  role: UserRole = "secretaria",
): Promise<UserRow> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `INSERT INTO users (username, password_hash, role, name, troca_senha_obrigatoria)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING id, username, role, name, active, troca_senha_obrigatoria, created_at`,
    [username, password_hash, role, name],
  );
  const user = result.rows[0];
  if (!user) {
    throw new Error(
      "Falha ao criar usuário: nenhum dado foi retornado após a inserção.",
    );
  }
  return user;
}

async function getUserById(id: number): Promise<UserRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `SELECT id, username, role, name, active, troca_senha_obrigatoria, created_at FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

async function findUserByUsernameForAdmin(
  username: string,
): Promise<UserRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `SELECT id, username, role, name, active, troca_senha_obrigatoria, created_at FROM users WHERE username = $1`,
    [username.trim().toLowerCase()],
  );
  return result.rows[0] ?? null;
}

async function updateUserById(
  id: number,
  username: string,
  name: string,
  role: UserRole,
  active: boolean,
): Promise<UserRow | null> {
  await ensureAuthSchema();
  const params: Array<string | number | boolean> = [
    username,
    name,
    role,
    active,
    id,
  ];

  const result = await pool.query<UserRow>(
    `UPDATE users
       SET username = $1,
           name = $2,
           role = $3,
           active = $4
     WHERE id = $5
     RETURNING id, username, role, name, active, troca_senha_obrigatoria, created_at`,
    params,
  );

  return result.rows[0] ?? null;
}

async function updateMyAccountById(
  id: number,
  name: string,
): Promise<UserRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `UPDATE users
       SET name = $1
     WHERE id = $2
     RETURNING id, username, role, name, active, troca_senha_obrigatoria, created_at`,
    [name, id],
  );
  return result.rows[0] ?? null;
}

async function getUserAuthById(id: number): Promise<UserRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `SELECT id, username, password_hash, role, name, active, troca_senha_obrigatoria, created_at
       FROM users
      WHERE id = $1 AND active = TRUE`,
    [id],
  );
  return result.rows[0] ?? null;
}

async function updateUserPasswordById(
  id: number,
  password_hash: string,
): Promise<boolean> {
  await ensureAuthSchema();
  const result = await pool.query(
    `UPDATE users SET password_hash = $1, troca_senha_obrigatoria = FALSE WHERE id = $2 RETURNING id`,
    [password_hash, id],
  );
  return (result.rowCount ?? 0) > 0;
}

async function resetUserPasswordById(
  id: number,
  password_hash: string,
): Promise<UserRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `UPDATE users
        SET password_hash = $1,
            troca_senha_obrigatoria = TRUE
      WHERE id = $2
      RETURNING id, username, role, name, active, troca_senha_obrigatoria, created_at`,
    [password_hash, id],
  );
  return result.rows[0] ?? null;
}

async function updateUserStatusById(
  id: number,
  active: boolean,
): Promise<UserRow | null> {
  await ensureAuthSchema();
  const result = await pool.query<UserRow>(
    `UPDATE users
       SET active = $1
     WHERE id = $2
     RETURNING id, username, role, name, active, troca_senha_obrigatoria, created_at`,
    [active, id],
  );
  return result.rows[0] ?? null;
}

async function deleteUserById(id: number): Promise<boolean> {
  await ensureAuthSchema();
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 AND role = 'secretaria' RETURNING id`,
    [id],
  );
  return (result.rowCount ?? 0) > 0;
}

async function getAllLogs(
  limit: number,
  offset: number,
): Promise<FullfillmentLog[]> {
  const result = await pool.query<FullfillmentLog>(
    `SELECT id, session_id, navigation_flow, inquiry_ids, flag, created_at 
     FROM fulfillment_logs 
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return result.rows;
}

async function getLogStats(): Promise<LogStat[]> {
  const query = `
    SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        (navigation_flow -> 0 ->> 'title') AS category,
        COUNT(*)::int AS log_count
    FROM
        fulfillment_logs
    WHERE
        (navigation_flow -> 0 ->> 'title') IS NOT NULL
        AND (navigation_flow -> 0 ->> 'title') != ''
    GROUP BY
        month,
        category
    ORDER BY
        month DESC,
        category ASC;
  `;
  const { rows } = await pool.query<LogStat>(query);
  return rows;
}

async function getSatisfactionStats(): Promise<SatisfactionStat[]> {
  const query = `
    SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        flag,
        COUNT(*)::int AS count
    FROM
        fulfillment_logs
    GROUP BY
        month,
        flag
    ORDER BY
        month DESC;
  `;
  const { rows } = await pool.query<SatisfactionStat>(query);
  return rows;
}

export {
  searchAllNodes,
  searchNodeById,
  deleteNodeById,
  updateNodeById,
  findNodeById,
  isNodeDescendant,
  createNode,
  getSupportContactById,
  updateSupportContactById,
  deleteSupportContactById,
  getSupportContactAll,
  getSupportContactByStatus,
  getSupportContactStats,
  createFulfillmentLog,
  getAllSecretariaUsers,
  createSecretariaUser,
  getUserById,
  findUserByUsernameForAdmin,
  updateUserById,
  updateMyAccountById,
  getUserAuthById,
  updateUserPasswordById,
  resetUserPasswordById,
  updateUserStatusById,
  deleteUserById,
  getAllLogs,
  getLogStats,
  getInquiryStats,
  getInquiryStatsLeaf,
  getSatisfactionStats,
};
