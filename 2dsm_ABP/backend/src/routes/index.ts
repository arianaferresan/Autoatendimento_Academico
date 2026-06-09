import routerADMIN from '@/routes/routes_crud_ADMIN.js';
import { Router } from 'express';
import routerPUBLIC from './routes_crud_PUBLIC.js';
import authRoutes from './authRoutes.js';

const routes = Router();

routes.use('/admin', routerADMIN);
routes.use('/api', routerPUBLIC);
routes.use('/auth', authRoutes);

export default routes;
