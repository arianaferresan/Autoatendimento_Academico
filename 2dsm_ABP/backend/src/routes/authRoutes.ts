import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// POST /auth/login  →  autentica e retorna o JWT
router.post('/login', login);

// GET  /auth/me     →  retorna dados do usuário logado
router.get('/me', authMiddleware, me);


export default router;
