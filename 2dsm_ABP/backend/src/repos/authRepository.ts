import { pool } from "../config/database.js";
import type { UserRow } from "../types/types.js";

export async function findUserByUsername(
  username: string,
): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE username = $1 AND active = TRUE",
    [username.trim().toLowerCase()],
  );
  return result.rows[0] ?? null;
}
