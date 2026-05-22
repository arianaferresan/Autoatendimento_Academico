import type { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "@/server/config/database.js";
import type { JwtPayload, UserRow } from "@/types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_troque_em_producao";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "8h";

// POST /auth/login
export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  // Validação básica de entrada
  if (!username || !password) {
    res.status(400).json({ message: "username e password são obrigatórios." });
    return;
  }

  try {
    // Busca o usuário pelo username
    const result = await pool.query<UserRow>(
      "SELECT * FROM users WHERE username = $1 AND active = TRUE",
      [username.trim().toLowerCase()],
    );

    const user = result.rows[0];

    // Usuário não encontrado — mensagem genérica para não vazar informação
    if (!user) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    // Verifica a senha contra o hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    // Monta o payload do JWT
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

// GET /auth/me → retorna os dados do usuário logado (token já validado pelo middleware)
export function me(req: Request, res: Response): void {
  // req.user agora é corretamente tipado graças à fusão de declarações (declaration merging)
  res.status(200).json({ user: req.user });
}
