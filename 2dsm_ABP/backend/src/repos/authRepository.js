import { pool } from "../config/database.js";
export async function findUserByUsername(username) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1 AND active = TRUE", [username.trim().toLowerCase()]);
    return result.rows[0] ?? null;
}
//# sourceMappingURL=authRepository.js.map