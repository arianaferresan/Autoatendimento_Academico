import { pool } from "@/server/config/database.js";

import type { Node, SupportContact, FullfillmentLog} from "@/types/typesAdmin.js";

async function searchAllNodes(): Promise<Node[]> {
  const result = await pool.query<Node>(
    `SELECT id, parent_id, title, content, display_order, link, is_active, created_at, updated_at 
            FROM navigation_nodes 
            ORDER BY title ASC`,
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
    `SELECT id, email, message, status, created_at, closed_at, answered_by FROM support_contacts WHERE id = $1`,
    [id],
  );
  return result.rows[0];
}

async function getSupportContactAll(): Promise<SupportContact[]> {
  const result = await pool.query<SupportContact>(
    `SELECT id, email, message, status, created_at, closed_at, answered_by FROM support_contacts ORDER BY created_at DESC`,
  );
  return result.rows;
}

async function updateSupportContactById(
  id: number,
  status: SupportContact["status"],
  answered_by: string | null,
): Promise<SupportContact | undefined> {
  const result = await pool.query<SupportContact>(
  `
  UPDATE support_contacts 
  SET status = $2::inquiry_status, answered_by = $3, closed_at = CASE WHEN $2::inquiry_status = 'RESPONDIDA' THEN NOW() ELSE closed_at END
  WHERE id = $1
  RETURNING *`,
  [id, status, answered_by],
);
  return result.rows[0];
}

async function getSupportContactByStatus(status: SupportContact["status"], offset: number ): Promise<SupportContact[]> {
  const result = await pool.query<SupportContact>(
    `SELECT id, email, message, status, created_at, closed_at, answered_by FROM support_contacts WHERE status = $1 LIMIT 10 OFFSET $2`,
    [status, offset],
  );
  return result.rows;
};

//Melhorar essa função - FUNÇÂO
async function deleteSupportContactById(id: number): Promise<void> {
  await pool.query(
    `
    DELETE FROM support_contacts 
    WHERE id = $1`,
    [id],
  );
}

// Repos para logs de atendimento - FUNÇÂO
async function getAllFulfillmentLogs(): Promise<any[]> {
  const result = await pool.query(
    `SELECT session_id, navigation_flow, inquiry_ids, flag FROM fulfillment_logs ORDER BY created_at DESC`,
  );
  return result.rows;
};

async function createFulfillmentLog(data: Omit<FullfillmentLog, 'session_id'>): Promise<void> {
  await pool.query(
    `INSERT INTO fulfillment_logs ( navigation_flow, inquiry_ids, flag) VALUES ($1, $2, $3)`,
    [data.navigation_flow, data.inquiry_ids, data.flag],
  );
};

export {
  searchAllNodes,
  searchNodeById,
  deleteNodeById,
  updateNodeById,
  findNodeById,
  createNode,
  getSupportContactById,
  updateSupportContactById,
  deleteSupportContactById,
  getSupportContactAll,
  getSupportContactByStatus,
  getAllFulfillmentLogs,
  createFulfillmentLog,
};
