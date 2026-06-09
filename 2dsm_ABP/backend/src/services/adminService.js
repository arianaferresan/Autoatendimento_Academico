import bcrypt from "bcrypt";
import { deleteNodeById, searchAllNodes, searchNodeById, findNodeById, updateNodeById, createNode, updateSupportContactById, deleteSupportContactById, getSupportContactAll, getSupportContactById, getSupportContactByStatus, getSupportContactStats, createFulfillmentLog, getAllSecretariaUsers, createSecretariaUser, deleteUserById, getAllLogs, getLogStats, getInquiryStats, getInquiryStatsLeaf, getSatisfactionStats, } from "@/repos/adminRpository.js";
export const getAllNodesService = async () => {
    // Aqui é onde colocaria regras de negócio se existissem.
    // Ex: formatar um dado antes de mandar para a tela, ou calcular estatísticas.
    const nodes = await searchAllNodes();
    return nodes;
};
export const getNodeByIdService = async (id) => {
    const node = await searchNodeById(id);
    return node;
};
export const deleteNodeByIdService = async (id) => {
    await deleteNodeById(id);
};
export const updateNodeService = async (id, data) => {
    const currentNode = await findNodeById(id);
    if (!currentNode) {
        return null;
    }
    const chunk_path = data.new_chunk_path ?? currentNode.chunk_path;
    const updatedNode = await updateNodeById(id, data.parent_id, data.title, data.content, data.display_order, data.link, data.is_active, chunk_path);
    return updatedNode;
};
export const createNodeService = async (data) => {
    // Aqui poderiam entrar regras de negócio, como verificar se já existe um nó com o mesmo título.
    const newNode = await createNode(data.parent_id, data.title, data.content, data.display_order, data.link, data.is_active, data.chunk_path);
    return newNode;
};
export const getSupportContactByIdService = async (id) => {
    const contact = await getSupportContactById(id);
    return contact;
};
export const getAllSupportContactsService = async (limit, offset) => {
    const contacts = await getSupportContactAll(limit, offset);
    return contacts;
};
export const getSupportContactByStatusService = async (status, limit, offset) => {
    const contacts = await getSupportContactByStatus(status, limit, offset);
    return contacts;
};
export const updateSupportContactByIdService = async (id, status, answered_by) => {
    const updatedContact = await updateSupportContactById(id, status, answered_by);
    return updatedContact;
};
export const deleteSupportContactByIdService = async (id) => {
    await deleteSupportContactById(id);
};
export const createFulfillmentLogService = async (data) => {
    await createFulfillmentLog(data);
};
export const getSupportContactStatsService = async () => {
    return getSupportContactStats();
};
export const getInquiryStatsService = async () => {
    return getInquiryStats();
};
export const getInquiryStatsLeafService = async () => {
    return getInquiryStatsLeaf();
};
export const getAllSecretariaUsersService = async () => {
    return getAllSecretariaUsers();
};
export const createSecretariaUserService = async (username, password, name) => {
    const password_hash = await bcrypt.hash(password, 10);
    return createSecretariaUser(username, password_hash, name);
};
export const deleteUserService = async (id) => {
    return deleteUserById(id);
};
export const getAllLogsService = async (limit, offset) => {
    return getAllLogs(limit, offset);
};
export const getLogsStatsService = async () => {
    // Aqui poderiam entrar regras de negócio, como calcular estatísticas a partir dos logs.
    const stats = await getLogStats();
    return stats;
};
export const getSatisfactionStatsService = async () => {
    const stats = await getSatisfactionStats();
    return stats;
};
//# sourceMappingURL=adminService.js.map