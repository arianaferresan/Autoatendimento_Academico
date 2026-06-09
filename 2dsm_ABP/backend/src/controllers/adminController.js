import { getAllNodesService, getNodeByIdService, deleteNodeByIdService, updateNodeService, createNodeService, getSupportContactByIdService, updateSupportContactByIdService, deleteSupportContactByIdService, getAllSupportContactsService, getSupportContactByStatusService, getSupportContactStatsService, getAllSecretariaUsersService, createSecretariaUserService, deleteUserService, getAllLogsService, getLogsStatsService, getInquiryStatsService, getInquiryStatsLeafService, getSatisfactionStatsService, } from "@/services/adminService.js";
export const getAllNodes = async (_req, res) => {
    try {
        const nodes = await getAllNodesService();
        res.json(nodes);
    }
    catch (error) {
        console.error("Erro ao buscar todos os nós:", error);
        res.status(500).json({ error: "Erro ao buscar todos os nós" });
    }
};
export const filterNodes = async (req, res) => {
    const { id } = req.params;
    try {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            res.status(400).json({ error: "O ID deve ser um número válido." });
            return;
        }
        // 5. Chamamos o Service (com o AWAIT!)
        // Lembre-se: 'result' agora já é o array (nodes), não tem mais '.rows'
        const result = await getNodeByIdService(idNum);
        if (result.length === 0) {
            res
                .status(404)
                .json({ message: "Classe principal não encontrada ou sem ramos." });
            return;
        }
        res.json(result);
    }
    catch (error) {
        console.error("Erro ao buscar árvore:", error);
        res.status(500).json({ error: "Erro ao processar estrutura da árvore" });
    }
};
export const deleteNode = async (req, res) => {
    const { id } = req.params;
    try {
        const idNum = parseInt(id, 10);
        await deleteNodeByIdService(idNum);
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar nó:", error);
        res.status(500).json({ error: "Erro ao deletar nó" });
    }
};
export const updateNode = async (req, res) => {
    try {
        const { id } = req.params;
        const { parent_id, title, content, display_order, link, is_active } = req.body;
        const new_chunk_path = req.file ? req.file.path : null;
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            res.status(400).json({ error: "O ID deve ser um número válido." });
            return;
        }
        const parentIdNum = parent_id && parent_id !== "null" ? parseInt(parent_id, 10) : null;
        const displayOrderNum = display_order ? parseInt(display_order, 10) : 0;
        const isActiveBool = is_active !== undefined
            ? String(is_active).toLowerCase() === "true"
            : true;
        const data = {
            parent_id: parentIdNum,
            title,
            content: content || null,
            display_order: displayOrderNum,
            link: link && link.trim() !== "" && link !== "null" ? link : null,
            is_active: isActiveBool,
            new_chunk_path,
        };
        const updatedNode = await updateNodeService(idNum, data);
        if (!updatedNode) {
            res.status(404).json({ error: "Nó não encontrado" });
            return;
        }
        res.json(updatedNode);
    }
    catch (error) {
        console.error("Erro ao atualizar nó:", error);
        res.status(500).json({ error: "Erro ao atualizar nó" });
    }
};
export const creatNode = async (req, res) => {
    try {
        const { parent_id, title, content, display_order, link, is_active } = req.body;
        const chunk_path = req.file ? req.file.path : null;
        // Validação e conversão de tipos, assim como no update
        if (!title) {
            res.status(400).json({ error: "O título é obrigatório." });
            return;
        }
        const parentIdNum = parent_id && parent_id !== "null" ? parseInt(parent_id, 10) : null;
        const displayOrderNum = display_order ? parseInt(display_order, 10) : 0;
        const isActiveBool = is_active !== undefined
            ? String(is_active).toLowerCase() === "true"
            : true;
        const data = {
            parent_id: parentIdNum,
            title,
            content: content || null,
            display_order: displayOrderNum,
            link: link && link.trim() !== "" && link !== "null" ? link : null,
            is_active: isActiveBool,
            chunk_path,
        };
        const newNode = await createNodeService(data);
        res.status(201).json(newNode);
    }
    catch (error) {
        console.error("Erro ao criar nó:", error);
        res.status(500).json({ error: "Erro ao criar nó" });
    }
};
// ─── Support Contacts (Perguntas) ──────────────────────────────────────────────
export const getSupportContactById = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await getSupportContactByIdService(parseInt(id, 10));
        if (!contact) {
            res.status(404).json({ error: "Contato de suporte não encontrado." });
            return;
        }
        res.json(contact);
    }
    catch (error) {
        console.error("Erro ao buscar contato de suporte:", error);
        res.status(500).json({ error: "Erro ao buscar contato de suporte" });
    }
};
export const getAllSupportContacts = async (req, res) => {
    try {
        const { limit = "20", offset = "0" } = req.query;
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);
        if (isNaN(limitNum) || isNaN(offsetNum)) {
            return res.status(400).json({
                error: "Parâmetros 'limit' e 'offset' devem ser números válidos.",
            });
        }
        const contacts = await getAllSupportContactsService(limitNum, offsetNum);
        res.json(contacts);
    }
    catch (error) {
        console.error("Erro ao buscar contatos de suporte:", error);
        res.status(500).json({ error: "Erro ao buscar contatos de suporte" });
    }
};
export const getSupportContactStats = async (_req, res) => {
    try {
        const stats = await getSupportContactStatsService();
        res.status(200).json(stats);
    }
    catch (error) {
        console.error("Erro ao buscar estatísticas de perguntas:", error);
        res
            .status(500)
            .json({ message: "Erro interno ao buscar estatísticas de perguntas." });
    }
};
export const updateSupportContactStatus = async (req, res) => {
    try {
        // O ID do usuário autenticado é extraído do objeto `req.user` populado pelo middleware de autenticação.
        // A asserção `as any` é usada aqui, mas o ideal seria estender a interface Request do Express.
        const userId = req.user?.id;
        if (!userId) {
            return res
                .status(401)
                .json({ error: "Usuário não autenticado ou ID não encontrado." });
        }
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ["ABERTA", "ATENDIMENTO", "RESPONDIDA"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: `Status inválido. Valores permitidos: ${validStatuses.join(", ")}.`,
            });
        }
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            res.status(400).json({ error: "O ID deve ser um número válido." });
            return;
        }
        const updatedContact = await updateSupportContactByIdService(idNum, status, userId);
        if (!updatedContact) {
            res.status(404).json({ error: "Contato de suporte não encontrado." });
            return;
        }
        res.json(updatedContact);
    }
    catch (error) {
        console.error("Erro ao atualizar contato de suporte:", error);
        res.status(500).json({ error: "Erro ao atualizar contato de suporte" });
    }
};
export const deleteSupportContact = async (req, res) => {
    const { id } = req.params;
    try {
        const idNum = parseInt(id, 10);
        await deleteSupportContactByIdService(idNum);
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar contato de suporte:", error);
        res.status(500).json({ error: "Erro ao deletar contato de suporte" });
    }
};
export const getSupportContactsByStatus = async (req, res) => {
    let { status } = req.params;
    const { limit = "10", offset = "0" } = req.query;
    status = String(status).toUpperCase().trim();
    const validStatuses = ["ABERTA", "ATENDIMENTO", "RESPONDIDA"];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Parâmetro 'status' inválido." });
    }
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);
    if (isNaN(limitNum) || isNaN(offsetNum)) {
        return res.status(400).json({
            error: "Parâmetros 'limit' e 'offset' devem ser números válidos.",
        });
    }
    try {
        const contacts = await getSupportContactByStatusService(status, limitNum, offsetNum);
        res.json(contacts);
    }
    catch (error) {
        console.error("Erro ao buscar contatos de suporte por status:", error);
        res
            .status(500)
            .json({ error: "Erro ao buscar contatos de suporte por status" });
    }
};
// ─── Usuários (Secretária) ─────────────────────────────────────────────────────
export const getAllSecretariaUsers = async (_req, res) => {
    try {
        const users = await getAllSecretariaUsersService();
        res.json(users);
    }
    catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};
export const createSecretariaUser = async (req, res) => {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
        res
            .status(400)
            .json({ error: "username, password e name são obrigatórios." });
        return;
    }
    try {
        const user = await createSecretariaUserService(username, password, name);
        res.status(201).json(user);
    }
    catch (error) {
        if (error?.code === "23505") {
            res.status(409).json({ error: "Username já existe." });
            return;
        }
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
};
export const deleteUser = async (req, res) => {
    const idNum = parseInt(String(req.params["id"] ?? ""), 10);
    if (isNaN(idNum)) {
        res.status(400).json({ error: "ID inválido." });
        return;
    }
    try {
        const deleted = await deleteUserService(idNum);
        if (!deleted) {
            res.status(404).json({ error: "Usuário não encontrado." });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
};
// ─── Logs ──────────────────────────────────────────────────────────────────────
export const getAllLogs = async (req, res) => {
    try {
        const { limit = "20", offset = "0" } = req.query;
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);
        if (isNaN(limitNum) || isNaN(offsetNum)) {
            return res.status(400).json({
                error: "Parâmetros 'limit' e 'offset' devem ser números válidos.",
            });
        }
        const logs = await getAllLogsService(limitNum, offsetNum);
        res.json(logs);
    }
    catch (error) {
        console.error("Erro ao buscar logs:", error);
        res.status(500).json({ error: "Erro ao buscar logs" });
    }
};
export const getLogsStats = async (req, res) => {
    try {
        const stats = await getLogsStatsService();
        res.status(200).json(stats);
    }
    catch (error) {
        console.error("Erro ao buscar estatísticas de logs:", error);
        res.status(500).json({
            message: "Erro interno ao buscar estatísticas de logs.",
        });
    }
};
export const getSatisfactionStats = async (req, res) => {
    try {
        const stats = await getSatisfactionStatsService();
        res.status(200).json(stats);
    }
    catch (error) {
        console.error("Erro ao buscar estatísticas de satisfação:", error);
        res.status(500).json({
            message: "Erro interno ao buscar estatísticas de satisfação.",
        });
    }
};
export const getInquiryStats = async (_req, res) => {
    try {
        const stats = await getInquiryStatsService();
        res.status(200).json(stats);
    }
    catch (error) {
        console.error("Erro ao buscar estatísticas de perguntas por ID:", error);
        res.status(500).json({
            message: "Erro interno ao buscar estatísticas de perguntas acessadas.",
        });
    }
};
export const getInquiryStatsLeaf = async (_req, res) => {
    try {
        const stats = await getInquiryStatsLeafService();
        res.status(200).json(stats);
    }
    catch (error) {
        console.error("Erro ao buscar estatísticas de perguntas folha:", error);
        res.status(500).json({
            message: "Erro interno ao buscar estatísticas de perguntas folha.",
        });
    }
};
//# sourceMappingURL=adminController.js.map