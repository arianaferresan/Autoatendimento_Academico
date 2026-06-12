import routerADMIN from '@/routes/routes_crud_ADMIN.js';
import { Router } from 'express';
import routerPUBLIC from './routes_crud_PUBLIC.js';
import authRoutes from './authRoutes.js';
import {
  cancelPasswordResetRequest,
  getPasswordResetRequests,
  changeMyPassword,
  resetUserPasswordByAdmin,
  resolvePasswordResetRequest,
  updateMyAccount,
} from '@/controllers/adminController.js';
import { authMiddleware, authorize } from '@/middleware/authMiddleware.js';

const routes = Router();

routes.use('/admin', routerADMIN);
routes.use('/api', routerPUBLIC);
routes.use('/auth', authRoutes);
routes.get(
  '/users/password-reset-requests',
  authMiddleware,
  authorize('admin'),
  getPasswordResetRequests,
);
routes.post(
  '/users/password-reset-requests/:id/resolve',
  authMiddleware,
  authorize('admin'),
  resolvePasswordResetRequest,
);
routes.post(
  '/users/password-reset-requests/:id/cancel',
  authMiddleware,
  authorize('admin'),
  cancelPasswordResetRequest,
);
routes.post(
  '/users/:id/reset-password',
  authMiddleware,
  authorize('admin'),
  resetUserPasswordByAdmin,
);
routes.put(
  '/me/profile',
  authMiddleware,
  authorize('admin', 'secretaria'),
  updateMyAccount,
);
routes.put(
  '/me/password',
  authMiddleware,
  authorize('admin', 'secretaria'),
  changeMyPassword,
);

export default routes;
