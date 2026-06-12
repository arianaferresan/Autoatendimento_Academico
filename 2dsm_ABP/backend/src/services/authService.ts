import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  createPasswordResetRequest,
  createPasswordResetToken,
  findUserByUsername,
  findUserForPasswordReset,
  findValidPasswordResetToken,
  invalidateUnusedPasswordResetTokens,
  markPasswordResetTokenUsed,
  updatePasswordAfterReset,
} from "../repos/authRepository.js";
import type { JwtPayload } from "../types/types.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_troque_em_producao";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "8h";
const PASSWORD_RESET_MINUTES = Number(process.env.PASSWORD_RESET_MINUTES ?? 30);
const APP_URL = process.env.APP_URL || "http://localhost:5173";

function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function authenticateUser(
  username: string,
  password: string,
): Promise<{ token: string; user: JwtPayload }> {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload: JwtPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    mustChangePassword: user.troca_senha_obrigatoria,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES as any,
  });

  return { token, user: payload };
}

export async function requestPasswordReset(username: string): Promise<void> {
  const normalizedUsername = username.trim().toLowerCase();
  const user = await findUserForPasswordReset(username);

  if (!user) {
    await createPasswordResetRequest(normalizedUsername, null);
    console.info("[auth] Solicitacao de senha registrada para usuario inexistente ou inativo.");
    return;
  }

  await createPasswordResetRequest(normalizedUsername, user.id);
  console.info(`[auth] Solicitacao de senha registrada para ${user.username}.`);
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  const tokenHash = hashResetToken(token);
  const resetToken = await findValidPasswordResetToken(tokenHash);

  if (!resetToken) {
    throw new Error("INVALID_OR_EXPIRED_TOKEN");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updatePasswordAfterReset(resetToken.user_id, passwordHash);
  await markPasswordResetTokenUsed(resetToken.id);
}
