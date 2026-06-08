import bcrypt from "bcrypt";
import {
  deleteNodeById,
  searchAllNodes,
  searchNodeById,
  findNodeById,
  updateNodeById,
  createNode,
  updateSupportContactById,
  deleteSupportContactById,
  getSupportContactAll,
  getSupportContactById,
  getSupportContactByStatus,
  getSupportContactStats,
  createFulfillmentLog,
  getAllSecretariaUsers,
  createSecretariaUser,
  deleteUserById,
  getAllLogs,
  getLogStats,
  getInquiryStats,
  getInquiryStatsLeaf,
} from "@/repos/adminRpository.js";

import type {
  CreateNodeData,
  FullfillmentLog,
  SupportContact,
  UpdateNodeData,
} from "@/types/typesAdmin.js";

export const getAllNodesService = async () => {
  // Aqui é onde colocaria regras de negócio se existissem.
  // Ex: formatar um dado antes de mandar para a tela, ou calcular estatísticas.

  const nodes = await searchAllNodes();
  return nodes;
};

export const getNodeByIdService = async (id: number) => {
  const node = await searchNodeById(id);
  return node;
};

export const deleteNodeByIdService = async (id: number) => {
  await deleteNodeById(id);
};

export const updateNodeService = async (id: number, data: UpdateNodeData) => {
  const currentNode = await findNodeById(id);

  if (!currentNode) {
    return null;
  }

  const chunk_path = data.new_chunk_path ?? currentNode.chunk_path;

  const updatedNode = await updateNodeById(
    id,
    data.parent_id,
    data.title,
    data.content,
    data.display_order,
    data.link,
    data.is_active,
    chunk_path,
  );

  return updatedNode;
};

export const createNodeService = async (data: CreateNodeData) => {
  // Aqui poderiam entrar regras de negócio, como verificar se já existe um nó com o mesmo título.
  const newNode = await createNode(
    data.parent_id,
    data.title,
    data.content,
    data.display_order,
    data.link,
    data.is_active,
    data.chunk_path,
  );
  return newNode;
};

export const getSupportContactByIdService = async (
  id: number,
): Promise<SupportContact | undefined> => {
  const contact = await getSupportContactById(id);
  return contact;
};

export const getAllSupportContactsService = async (
  limit: number,
  offset: number,
): Promise<SupportContact[]> => {
  const contacts = await getSupportContactAll(limit, offset);
  return contacts;
};

export const getSupportContactByStatusService = async (
  status: SupportContact["status"],
  limit: number,
  offset: number,
): Promise<SupportContact[]> => {
  const contacts = await getSupportContactByStatus(status, limit, offset);
  return contacts;
};

export const updateSupportContactByIdService = async (
  id: number,
  status: SupportContact["status"],
  answered_by: number | null,
): Promise<SupportContact | undefined> => {
  const updatedContact = await updateSupportContactById(
    id,
    status,
    answered_by,
  );
  return updatedContact;
};

export const deleteSupportContactByIdService = async (id: number) => {
  await deleteSupportContactById(id);
};

export const createFulfillmentLogService = async (
  data: Omit<FullfillmentLog, "session_id">,
) => {
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

export const createSecretariaUserService = async (
  username: string,
  password: string,
  name: string,
) => {
  const password_hash = await bcrypt.hash(password, 10);
  return createSecretariaUser(username, password_hash, name);
};

export const deleteUserService = async (id: number): Promise<boolean> => {
  return deleteUserById(id);
};

export const getAllLogsService = async (limit: number, offset: number) => {
  return getAllLogs(limit, offset);
};

export const getLogsStatsService = async () => {
  // Aqui poderiam entrar regras de negócio, como calcular estatísticas a partir dos logs.
  const stats = await getLogStats();
  return stats;
};
