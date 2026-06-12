import { Router } from 'express';
import {
  forgotPassword,
  login,
  me,
  resetUserPassword,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// POST /auth/login  →  autentica e retorna o JWT
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetUserPassword);

// GET  /auth/me     →  retorna dados do usuário logado
router.get('/me', authMiddleware, me);


export default router;
