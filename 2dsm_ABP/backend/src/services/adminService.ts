import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  deleteNodeById,
  searchAllNodes,
  searchNodeById,
  findNodeById,
  isNodeDescendant,
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
  getUserById,
  findUserByUsernameForAdmin,
  updateUserById,
  updateMyAccountById,
  getUserAuthById,
  updateUserPasswordById,
  resetUserPasswordById,
  updateUserStatusById,
  deleteUserById,
  getAllLogs,
  getLogStats,
  getInquiryStats,
  getInquiryStatsLeaf,
  getSatisfactionStats,
} from "@/repos/adminRepository.js";
import {
  cancelPasswordResetRequest,
  getPasswordResetRequestById,
  listPasswordResetRequests,
  resolvePasswordResetRequest,
} from "@/repos/authRepository.js";

import type {
  CreateNodeData,
  FullfillmentLog,
  SupportContact,
  UpdateNodeData,
} from "@/types/typesAdmin.js";
import type { UserRole } from "@/types/types.js";
import type {
  PasswordResetRequestRow,
  PasswordResetRequestStatus,
} from "@/types/types.js";

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

  if (data.parent_id === id) {
    throw new Error("INVALID_PARENT_SELF");
  }

  if (data.parent_id !== null) {
    const parentNode = await findNodeById(data.parent_id);
    if (!parentNode) {
      throw new Error("PARENT_NOT_FOUND");
    }

    const parentIsDescendant = await isNodeDescendant(id, data.parent_id);
    if (parentIsDescendant) {
      throw new Error("INVALID_PARENT_DESCENDANT");
    }
  }

  const chunk_path =
    data.chunk_path !== undefined ? data.chunk_path : currentNode.chunk_path;

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
  if (data.parent_id !== null) {
    const parentNode = await findNodeById(data.parent_id);
    if (!parentNode) {
      throw new Error("PARENT_NOT_FOUND");
    }
  }

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
  data: Omit<FullfillmentLog, "id" | "session_id" | "created_at">,
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
  name: string,
  role: UserRole = "secretaria",
) => {
  const temporaryPassword = `Fatec-${crypto.randomBytes(4).toString("hex")}`;
  const password_hash = await bcrypt.hash(temporaryPassword, 10);
  const user = await createSecretariaUser(
    username.trim().toLowerCase(),
    password_hash,
    name.trim(),
    role,
  );

  return { user, temporaryPassword };
};

export const getUserByIdService = async (id: number) => {
  return getUserById(id);
};

export const updateUserService = async (
  id: number,
  data: {
    username: string;
    name: string;
    role: UserRole;
    active: boolean;
  },
) => {
  return updateUserById(
    id,
    data.username.trim().toLowerCase(),
    data.name.trim(),
    data.role,
    data.active,
  );
};

export const updateMyAccountService = async (id: number, name: string) => {
  return updateMyAccountById(id, name.trim());
};

export const changeMyPasswordService = async (
  id: number,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await getUserAuthById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!passwordMatch) {
    throw new Error("INVALID_CURRENT_PASSWORD");
  }

  const password_hash = await bcrypt.hash(newPassword, 10);
  return updateUserPasswordById(id, password_hash);
};

export const resetUserPasswordByAdminService = async (id: number) => {
  const temporaryPassword = `Fatec-${crypto.randomBytes(5).toString("hex")}`;
  const password_hash = await bcrypt.hash(temporaryPassword, 10);
  const user = await resetUserPasswordById(id, password_hash);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return { user, temporaryPassword };
};

export const getPasswordResetRequestsService = async (
  status?: PasswordResetRequestStatus,
): Promise<PasswordResetRequestRow[]> => {
  return listPasswordResetRequests(status);
};

export const resolvePasswordResetRequestService = async (
  requestId: number,
  adminId: number,
) => {
  const request = await getPasswordResetRequestById(requestId);
  if (!request) {
    throw new Error("PASSWORD_RESET_REQUEST_NOT_FOUND");
  }
  if (request.status !== "pendente") {
    throw new Error("PASSWORD_RESET_REQUEST_NOT_PENDING");
  }
  if (!request.usuario_id) {
    throw new Error("PASSWORD_RESET_REQUEST_WITHOUT_USER");
  }

  const temporaryPassword = `Fatec-${crypto.randomBytes(6).toString("hex")}`;
  const password_hash = await bcrypt.hash(temporaryPassword, 10);
  const updatedRequest = await resolvePasswordResetRequest(
    requestId,
    adminId,
    password_hash,
  );

  if (!updatedRequest) {
    throw new Error("PASSWORD_RESET_REQUEST_NOT_PENDING");
  }

  return { request: updatedRequest, temporaryPassword };
};

export const cancelPasswordResetRequestService = async (
  requestId: number,
  adminId: number,
  observacao: string | null,
) => {
  const request = await cancelPasswordResetRequest(
    requestId,
    adminId,
    observacao,
  );
  if (!request) {
    throw new Error("PASSWORD_RESET_REQUEST_NOT_PENDING");
  }

  return request;
};

export const updateUserStatusService = async (
  id: number,
  active: boolean,
) => {
  return updateUserStatusById(id, active);
};

export const usernameBelongsToAnotherUserService = async (
  username: string,
  currentUserId?: number,
) => {
  const existing = await findUserByUsernameForAdmin(username);
  return Boolean(existing && existing.id !== currentUserId);
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

export const getSatisfactionStatsService = async () => {
  const stats = await getSatisfactionStats();
  return stats;
};
