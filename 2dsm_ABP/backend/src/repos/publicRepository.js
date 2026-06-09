import { pool } from "@/server/config/database.js";
async function deleteAllNodes() {
    const query = "DELETE FROM navigation_nodes;";
    const result = await pool.query(query);
    return result;
}
async function getNodesByParentId(parentId) {
    const query = parentId
        ? "SELECT id, title, display_order FROM navigation_nodes WHERE is_active = true AND parent_id = $1 ORDER BY display_order ASC, title ASC"
        : "SELECT id, title, display_order FROM navigation_nodes WHERE is_active = true AND parent_id IS NULL ORDER BY display_order ASC, title ASC";
    const params = parentId ? [parentId] : [];
    const result = await pool.query(query, params);
    return result.rows;
}
async function getLeafNodeById(id) {
    const query = "SELECT title, content, chunk_path, link FROM navigation_nodes WHERE id = $1 AND is_active = true";
    const result = await pool.query(query, [id]);
    return result.rows[0];
}
async function createSupportContact(email, message) {
    await pool.query(`
    INSERT INTO support_contacts (email, message, status) 
    VALUES ($1, $2, 'ABERTA')`, [email, message]);
}
export { deleteAllNodes, getNodesByParentId, getLeafNodeById, createSupportContact, };
//# sourceMappingURL=publicRepository.js.map