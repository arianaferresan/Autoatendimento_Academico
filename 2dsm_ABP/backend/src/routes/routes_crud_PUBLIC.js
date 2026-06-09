import { Router } from "express";
import { getPublicNodes, deleteALL, createSupportContact, createFulfillmentLog, } from "@/controllers/publicController.js";
const routerPUBLIC = Router();
//GET para o início do chat (sem id)
routerPUBLIC.get("/options", getPublicNodes);
//GET para o user a cada clique (com o id do nó atual)
// Clica e passa o node pega o id e faz um quary que retorna todas opções que tem o idparante igual ao id
routerPUBLIC.get("/options/:id", getPublicNodes);
//POST para o user enviar uma pergunta para a secretaria 
routerPUBLIC.post("/perguntas", createSupportContact);
//POST para criar um log de atendimento 
routerPUBLIC.post("/logs", createFulfillmentLog);
//DELETE ALL
routerPUBLIC.delete("/deve/deletall", deleteALL);
export default routerPUBLIC;
//# sourceMappingURL=routes_crud_PUBLIC.js.map