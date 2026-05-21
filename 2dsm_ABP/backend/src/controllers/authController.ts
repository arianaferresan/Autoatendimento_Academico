import type { Request, Response } from 'express';
import { authenticateUser } from '../services/authService.js';
import type { JwtPayload } from '../types.js';

// POST /auth/login
export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'username e password são obrigatórios.' });
    return;
  }

  try {
    const result = await authenticateUser(username, password);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

// GET /auth/me  →  retorna os dados do usuário logado (token já validado pelo middleware)
export function me(req: Request, res: Response): void {
  const user = (req as Request & { user: JwtPayload }).user;
  res.status(200).json({ user });
}
