import type { Request, Response } from "express";
import {
  authenticateUser,
  requestPasswordReset,
  resetPassword,
} from "../services/authService.js";
import type { JwtPayload } from "../types/types.js";

// POST /auth/login
export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "username e password são obrigatórios." });
    return;
  }

  try {
    const result = await authenticateUser(username, password);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

// GET /auth/me  →  retorna os dados do usuário logado (token já validado pelo middleware)
export function me(req: Request, res: Response): void {
  const user = (req as Request & { user: JwtPayload }).user;
  res.status(200).json({ user });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({ message: "Informe seu login institucional." });
    return;
  }

  try {
    await requestPasswordReset(String(username));
    res.status(200).json({
      message:
        "Solicitacao registrada. A equipe administrativa fara a redefinicao da senha.",
    });
  } catch (err) {
    console.error("Erro ao solicitar recuperacao de senha:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function resetUserPassword(req: Request, res: Response): Promise<void> {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: "token e password sao obrigatorios." });
    return;
  }

  if (String(password).length < 6) {
    res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
    return;
  }

  try {
    await resetPassword(String(token), String(password));
    res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_OR_EXPIRED_TOKEN") {
      res.status(400).json({ message: "Link invalido ou expirado." });
      return;
    }
    console.error("Erro ao redefinir senha:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}
