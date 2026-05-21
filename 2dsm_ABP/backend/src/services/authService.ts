import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../repos/authRepository.js';
import type { JwtPayload } from '../types.js';

const JWT_SECRET  = process.env.JWT_SECRET  || 'dev_secret_troque_em_producao';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '8h';

export async function authenticateUser(
  username: string,
  password: string
): Promise<{ token: string; user: JwtPayload }> {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const payload: JwtPayload = {
    id:       user.id,
    username: user.username,
    role:     user.role,
    name:     user.name,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES as any });

  return { token, user: payload };
}
