import jwt from "jsonwebtoken";
// ─── authMiddleware ────────────────────────────────────────────────────────────
// Valida o token JWT no cabeçalho Authorization: Bearer <token>
// Injeta req.user com o payload decodificado
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token não fornecido." });
        return;
    }
    const token = authHeader.split(" ")[1] ?? "";
    const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_troque_em_producao";
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res
                .status(401)
                .json({ message: "Token expirado. Faça login novamente." });
        }
        else {
            res.status(401).json({ message: "Token inválido." });
        }
    }
}
// ─── authorize ────────────────────────────────────────────────────────────────
// Uso: router.get('/rota', authMiddleware, authorize('admin'), handler)
// Aceita um ou mais roles permitidos
export function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Não autenticado." });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                message: "Acesso negado. Você não tem permissão para este recurso.",
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map