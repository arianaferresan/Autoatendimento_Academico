import { Router } from "express";
import { upload } from "@/server/config/multer.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { getAllNodes, filterNodes, deleteNode, updateNode, creatNode, getSupportContactById, updateSupportContactStatus, deleteSupportContact, getAllSupportContacts, getSupportContactsByStatus, getSupportContactStats, getAllSecretariaUsers, createSecretariaUser, deleteUser, getLogsStats, getAllLogs, getInquiryStats, getInquiryStatsLeaf, getSatisfactionStats, } from "@/controllers/adminController.js";
const routerADMIN = Router();
// Aplica o middleware de autenticação em TODAS as rotas deste arquivo.
// Nenhuma rota abaixo será acessível sem um token JWT válido.
routerADMIN.use(authMiddleware);
// GET all para o admin
routerADMIN.get("/nodes/all", authorize("admin", "secretaria"), getAllNodes);
//GET filter por ID das classes principais (1, 2 ,3 e 4)
routerADMIN.get("/nodes/filter/:id", authorize("admin", "secretaria"), filterNodes);
//DELETE por ID para o admin
routerADMIN.delete("/nodes/:id", authorize("admin"), deleteNode);
//UPDATE por ID para o admin
routerADMIN.put("/nodes/:id", authorize("admin"), upload.single("file"), updateNode);
//CREATE para o admin AJUSTAR O UPLOAD VIA MULTER
routerADMIN.post("/nodes/create", authorize("admin"), upload.single("file"), creatNode);
// ─── Perguntas (Support Contacts) ─────────────────────────────────────────────
//GET all para o admin listar as perguntas
routerADMIN.get("/perguntas", authorize("admin", "secretaria"), getAllSupportContacts);
// Rota para estatísticas de perguntas
routerADMIN.get("/perguntas/stats", authorize("admin", "secretaria"), getSupportContactStats);
//GET pergunta por ID
routerADMIN.get("/perguntas/:id", authorize("admin", "secretaria"), getSupportContactById);
//GET perguntas por status
routerADMIN.get("/perguntas/status/:status", authorize("admin", "secretaria"), getSupportContactsByStatus);
//PATCH para atualizar o status da pergunta
routerADMIN.patch("/perguntas/:id", authorize("admin", "secretaria"), updateSupportContactStatus);
//DELETE pergunta por ID
routerADMIN.delete("/perguntas/:id", authorize("admin"), deleteSupportContact);
// ─── Logs (fulfillment_logs)─────────────────────────────────────────────
routerADMIN.get("/logs", authorize("admin"), getAllLogs);
// Rota para estatísticas de logs
routerADMIN.get("/logs/stats", authorize("admin"), getLogsStats);
// Rota para estatísticas de satisfação
routerADMIN.get("/logs/satisfaction-stats", authorize("admin"), getSatisfactionStats);
// Rota para estatísticas de perguntas mais acessadas
routerADMIN.get("/logs/inquiry-stats", authorize("admin"), getInquiryStats);
// Rota para estatísticas de perguntas folha (respostas finais)
routerADMIN.get("/logs/inquiry-stats-leaf", authorize("admin"), getInquiryStatsLeaf);
// ─── Usuários (Secretária) ─────────────────────────────────────────────────────
routerADMIN.get("/usuarios", authorize("admin"), getAllSecretariaUsers);
routerADMIN.post("/usuarios", authorize("admin"), createSecretariaUser);
routerADMIN.delete("/usuarios/:id", authorize("admin"), deleteUser);
export default routerADMIN;
//# sourceMappingURL=routes_crud_ADMIN.js.map