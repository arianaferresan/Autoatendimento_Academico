import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
const router = Router();
// Todas as rotas admin exigem autenticação
router.use(authMiddleware);
// ─── Perguntas ────────────────────────────────────────────────────────────────
router.get('/perguntas', authorize('admin', 'secretaria'), (_req, res) => {
    res.json({ message: 'Lista de perguntas — a implementar.' });
});
router.patch('/perguntas/:id/status', authorize('admin', 'secretaria'), (req, res) => {
    res.json({ message: `Status da pergunta ${req.params.id} — a implementar.` });
});
// ─── Usuários ─────────────────────────────────────────────────────────────────
router.get('/usuarios', authorize('admin'), (_req, res) => {
    res.json({ message: 'Lista de usuários — a implementar.' });
});
router.post('/usuarios', authorize('admin'), (_req, res) => {
    res.json({ message: 'Criação de usuário — a implementar.' });
});
// ─── Logs ─────────────────────────────────────────────────────────────────────
router.get('/logs', authorize('admin'), (_req, res) => {
    res.json({ message: 'Logs — a implementar.' });
});
export default router;
//# sourceMappingURL=adminRoutes.js.map