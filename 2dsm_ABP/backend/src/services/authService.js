import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "../repos/authRepository.js";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_troque_em_producao";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "8h";
export async function authenticateUser(username, password) {
    const user = await findUserByUsername(username);
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
    });
    return { token, user: payload };
}
//# sourceMappingURL=authService.js.map