import { Router } from "express";
import { upload } from "@/server/config/multer.js";
import { authMiddleware, authorize } from "@/middleware/authMiddleware.js";

import {
  getAllNodes,
  filterNodes,
  deleteNode,
  updateNode,
  creatNode,
  getSupportContactById,
  updateSupportContactStatus,
  deleteSupportContact,
  getAllSupportContacts,
  getAllFulfillmentLogs,
  getSupportContactsByStatus,
} from "@/controllers/adminController.js";

const routerADMIN = Router();

// Aplica o middleware de autenticação em TODAS as rotas deste arquivo.
// Nenhuma rota abaixo será acessível sem um token JWT válido.
routerADMIN.use(authMiddleware);

// GET all para o admin
routerADMIN.get("/nodes/all", authorize("admin", "secretaria"), getAllNodes);

//GET filter por ID das classes principais (1, 2 ,3 e 4)
routerADMIN.get<{ id: string }>(
  "/nodes/filter/:id",
  authorize("admin", "secretaria"),
  filterNodes,
);

//DELETE por ID para o admin
routerADMIN.delete<{ id: string }>(
  "/nodes/:id",
  authorize("admin"),
  deleteNode,
);

//UPDATE por ID para o admin
routerADMIN.put<{ id: string }>(
  "/nodes/:id",
  authorize("admin"),
  upload.single("file"),
  updateNode,
);

//CREATE para o admin AJUSTAR O UPLOAD VIA MULTER
routerADMIN.post(
  "/nodes/create",
  authorize("admin"),
  upload.single("file"),
  creatNode,
);

// ─── Perguntas (Support Contacts) ─────────────────────────────────────────────

//GET all para o admin listar as perguntas
routerADMIN.get(
  "/perguntas",
  authorize("admin", "secretaria"),
  getAllSupportContacts,
);

//GET pergunta por ID
routerADMIN.get<{ id: string }>(
  "/perguntas/:id",
  authorize("admin", "secretaria"),
  getSupportContactById,
);

//GET perguntas por status
routerADMIN.get(
  "/perguntas/status/:status",
  authorize("admin", "secretaria"),
  getSupportContactsByStatus,
);

//PATCH para atualizar o status da pergunta
routerADMIN.patch<{ id: string }>(
  "/perguntas/:id",
  authorize("admin", "secretaria"),
  updateSupportContactStatus,
);

//DELETE pergunta por ID
routerADMIN.delete<{ id: string }>(
  "/perguntas/:id",
  authorize("admin"),
  deleteSupportContact,
);

// ─── Logs (fulfillment_logs)─────────────────────────────────────────────

routerADMIN.get("/logs", authorize("admin"), getAllFulfillmentLogs);

export default routerADMIN;
