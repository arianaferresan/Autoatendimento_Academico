import type { Request, Response } from "express";
import {
  getAllNodesService,
  getNodeByIdService,
  deleteNodeByIdService,
  updateNodeService,
  createNodeService,
  getSupportContactByIdService,
  updateSupportContactByIdService,
  deleteSupportContactByIdService,
  getAllSupportContactsService,
  getSupportContactByStatusService,
  getSupportContactStatsService,
  getAllSecretariaUsersService,
  createSecretariaUserService,
  getUserByIdService,
  updateUserService,
  updateUserStatusService,
  updateMyAccountService,
  changeMyPasswordService,
  cancelPasswordResetRequestService,
  getPasswordResetRequestsService,
  resolvePasswordResetRequestService,
  resetUserPasswordByAdminService,
  usernameBelongsToAnotherUserService,
  deleteUserService,
  getAllLogsService,
  getLogsStatsService,
  getInquiryStatsService,
  getInquiryStatsLeafService,
  getSatisfactionStatsService,
} from "@/services/adminService.js";
import { getUploadedPdfUrl } from "@/server/config/multer.js";

import type { NodesParams, SupportContact } from "@/types/typesAdmin.js";
import type { PasswordResetRequestStatus, UserRole } from "@/types/types.js";

const USER_ROLES: UserRole[] = ["admin", "secretaria"];

function isValidUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && USER_ROLES.includes(role as UserRole);
}

function parseNullableId(value: unknown): number | null {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "null"
  ) {
    return null;
  }

  const parsed = parseInt(String(value), 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error("INVALID_PARENT_ID");
  }

  return parsed;
}

function parseDisplayOrder(value: unknown): number {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const parsed = parseInt(String(value), 10);
  if (isNaN(parsed)) {
    throw new Error("INVALID_DISPLAY_ORDER");
  }

  return parsed;
}

function normalizeNullableText(value: unknown): string | null {
  if (value === undefined || value === null || value === "null") {
    return null;
  }

  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

export const getAllNodes = async (_req: Request, res: Response) => {
  try {
    const nodes = await getAllNodesService();
    res.json(nodes);
  } catch (error) {
    console.error("Erro ao buscar todos os nós:", error);
    res.status(500).json({ error: "Erro ao buscar todos os nós" });
  }
};

export const filterNodes = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

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
  } catch (error) {
    console.error("Erro ao buscar árvore:", error);
    res.status(500).json({ error: "Erro ao processar estrutura da árvore" });
  }
};

export const deleteNode = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const idNum = parseInt(id, 10);
    await deleteNodeByIdService(idNum);
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar nó:", error);
    res.status(500).json({ error: "Erro ao deletar nó" });
  }
};

export const updateNode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { parent_id, title, content, display_order, link, is_active, chunk_path } =
      req.body;

    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      res.status(400).json({ error: "O ID deve ser um número válido." });
      return;
    }

    if (!title || !String(title).trim()) {
      res.status(400).json({ error: "O tÃ­tulo Ã© obrigatÃ³rio." });
      return;
    }

    const parentIdNum = parseNullableId(parent_id);
    const displayOrderNum = parseDisplayOrder(display_order);
    const isActiveBool =
      is_active !== undefined
        ? String(is_active).toLowerCase() === "true"
        : true;
    const normalizedChunkPath = req.file
      ? getUploadedPdfUrl(req.file)
      : Object.prototype.hasOwnProperty.call(req.body, "chunk_path")
        ? normalizeNullableText(chunk_path)
        : undefined;

    const data = {
      parent_id: parentIdNum,
      title: String(title).trim(),
      content: normalizeNullableText(content),
      display_order: displayOrderNum,
      link: normalizeNullableText(link),
      is_active: isActiveBool,
      ...(normalizedChunkPath !== undefined
        ? { chunk_path: normalizedChunkPath }
        : {}),
    };

    const updatedNode = await updateNodeService(idNum, data);

    if (!updatedNode) {
      res.status(404).json({ error: "Nó não encontrado" });
      return;
    }

    res.json(updatedNode);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_PARENT_SELF") {
        res.status(400).json({ error: "Uma pasta ou item nao pode ser movido para dentro dele mesmo." });
        return;
      }
      if (error.message === "INVALID_PARENT_DESCENDANT") {
        res.status(400).json({ error: "Nao e permitido mover uma pasta para dentro de um descendente." });
        return;
      }
      if (error.message === "PARENT_NOT_FOUND") {
        res.status(400).json({ error: "Pasta pai nao encontrada." });
        return;
      }
      if (error.message === "INVALID_PARENT_ID") {
        res.status(400).json({ error: "Pasta pai invalida." });
        return;
      }
      if (error.message === "INVALID_DISPLAY_ORDER") {
        res.status(400).json({ error: "Ordem invalida." });
        return;
      }
    }
    console.error("Erro ao atualizar nó:", error);
    res.status(500).json({ error: "Erro ao atualizar nó" });
  }
};

export const creatNode = async (req: Request, res: Response) => {
  try {
    const { parent_id, title, content, display_order, link, is_active, chunk_path } =
      req.body;
    const normalizedChunkPath = req.file
      ? getUploadedPdfUrl(req.file)
      : normalizeNullableText(chunk_path);

    // Validação e conversão de tipos, assim como no update
    if (!title || !String(title).trim()) {
      res.status(400).json({ error: "O título é obrigatório." });
      return;
    }

    const parentIdNum = parseNullableId(parent_id);
    const displayOrderNum = parseDisplayOrder(display_order);
    const isActiveBool =
      is_active !== undefined
        ? String(is_active).toLowerCase() === "true"
        : true;

    const data = {
      parent_id: parentIdNum,
      title: String(title).trim(),
      content: normalizeNullableText(content),
      display_order: displayOrderNum,
      link: normalizeNullableText(link),
      is_active: isActiveBool,
      chunk_path: normalizedChunkPath,
    };

    const newNode = await createNodeService(data);

    res.status(201).json(newNode);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PARENT_NOT_FOUND") {
        res.status(400).json({ error: "Pasta pai nao encontrada." });
        return;
      }
      if (error.message === "INVALID_PARENT_ID") {
        res.status(400).json({ error: "Pasta pai invalida." });
        return;
      }
      if (error.message === "INVALID_DISPLAY_ORDER") {
        res.status(400).json({ error: "Ordem invalida." });
        return;
      }
    }
    console.error("Erro ao criar nó:", error);
    res.status(500).json({ error: "Erro ao criar nó" });
  }
};

// ─── Support Contacts (Perguntas) ──────────────────────────────────────────────
export const getSupportContactById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const contact = await getSupportContactByIdService(parseInt(id, 10));
    if (!contact) {
      res.status(404).json({ error: "Contato de suporte não encontrado." });
      return;
    }
    res.json(contact);
  } catch (error) {
    console.error("Erro ao buscar contato de suporte:", error);
    res.status(500).json({ error: "Erro ao buscar contato de suporte" });
  }
};

export const getAllSupportContacts = async (req: Request, res: Response) => {
  try {
    const { limit = "20", offset = "0" } = req.query;
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      return res.status(400).json({
        error: "Parâmetros 'limit' e 'offset' devem ser números válidos.",
      });
    }

    const contacts = await getAllSupportContactsService(limitNum, offsetNum);
    res.json(contacts);
  } catch (error) {
    console.error("Erro ao buscar contatos de suporte:", error);
    res.status(500).json({ error: "Erro ao buscar contatos de suporte" });
  }
};

export const getSupportContactStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getSupportContactStatsService();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de perguntas:", error);
    res
      .status(500)
      .json({ message: "Erro interno ao buscar estatísticas de perguntas." });
  }
};

export const updateSupportContactStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    // O ID do usuário autenticado é extraído do objeto `req.user` populado pelo middleware de autenticação.
    // A asserção `as any` é usada aqui, mas o ideal seria estender a interface Request do Express.
    const userId = (req as any).user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Usuário não autenticado ou ID não encontrado." });
    }

    const { id } = req.params as { id: string };
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

    const updatedContact = await updateSupportContactByIdService(
      idNum,
      status as SupportContact["status"],
      userId,
    );

    if (!updatedContact) {
      res.status(404).json({ error: "Contato de suporte não encontrado." });
      return;
    }

    res.json(updatedContact);
  } catch (error) {
    console.error("Erro ao atualizar contato de suporte:", error);
    res.status(500).json({ error: "Erro ao atualizar contato de suporte" });
  }
};

export const deleteSupportContact = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const idNum = parseInt(id, 10);
    await deleteSupportContactByIdService(idNum);
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar contato de suporte:", error);
    res.status(500).json({ error: "Erro ao deletar contato de suporte" });
  }
};

export const getSupportContactsByStatus = async (
  req: Request,
  res: Response,
) => {
  let { status } = req.params;
  const { limit = "10", offset = "0" } = req.query;

  status = String(status).toUpperCase().trim();

  const validStatuses = ["ABERTA", "ATENDIMENTO", "RESPONDIDA"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Parâmetro 'status' inválido." });
  }

  const limitNum = parseInt(limit as string, 10);
  const offsetNum = parseInt(offset as string, 10);

  if (isNaN(limitNum) || isNaN(offsetNum)) {
    return res.status(400).json({
      error: "Parâmetros 'limit' e 'offset' devem ser números válidos.",
    });
  }

  try {
    const contacts = await getSupportContactByStatusService(
      status as SupportContact["status"],
      limitNum,
      offsetNum,
    );
    res.json(contacts);
  } catch (error) {
    console.error("Erro ao buscar contatos de suporte por status:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar contatos de suporte por status" });
  }
};

// ─── Usuários (Secretária) ─────────────────────────────────────────────────────
export const getAllSecretariaUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllSecretariaUsersService();
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const createSecretariaUser = async (req: Request, res: Response) => {
  const { username, name } = req.body;
  if (!username || !name) {
    res
      .status(400)
      .json({ error: "username e name sao obrigatorios." });
    return;
  }
  try {
    const result = await createSecretariaUserService(username, name, "secretaria");
    res.status(201).json(result);
  } catch (error: any) {
    if (error?.code === "23505") {
      res.status(409).json({ error: "Username já existe." });
      return;
    }
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const idNum = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(idNum)) {
    res.status(400).json({ error: "ID invalido." });
    return;
  }

  try {
    const user = await getUserByIdService(idNum);
    if (!user) {
      res.status(404).json({ error: "Usuario nao encontrado." });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuario:", error);
    res.status(500).json({ error: "Erro ao buscar usuario" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, name, role = "secretaria" } = req.body;
  if (!username || !name) {
    res
      .status(400)
      .json({ error: "username e name sao obrigatorios." });
    return;
  }

  if (!isValidUserRole(role)) {
    res.status(400).json({ error: "Perfil de usuario invalido." });
    return;
  }

  try {
    const usernameExists = await usernameBelongsToAnotherUserService(username);
    if (usernameExists) {
      res.status(409).json({ error: "Login/e-mail ja existe." });
      return;
    }

    const result = await createSecretariaUserService(username, name, role);
    res.status(201).json(result);
  } catch (error: any) {
    if (error?.code === "23505") {
      res.status(409).json({ error: "Login/e-mail ja existe." });
      return;
    }
    console.error("Erro ao criar usuario:", error);
    res.status(500).json({ error: "Erro ao criar usuario" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const idNum = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(idNum)) {
    res.status(400).json({ error: "ID invalido." });
    return;
  }

  const { username, name, role, active } = req.body;
  if (!username || !name || !isValidUserRole(role)) {
    res
      .status(400)
      .json({ error: "username, name e role valido sao obrigatorios." });
    return;
  }

  if (typeof active !== "boolean") {
    res.status(400).json({ error: "active deve ser booleano." });
    return;
  }

  try {
    const current = await getUserByIdService(idNum);
    if (!current) {
      res.status(404).json({ error: "Usuario nao encontrado." });
      return;
    }

    const usernameExists = await usernameBelongsToAnotherUserService(
      username,
      idNum,
    );
    if (usernameExists) {
      res.status(409).json({ error: "Login/e-mail ja existe." });
      return;
    }

    if (req.user?.id === idNum && active === false) {
      res.status(400).json({ error: "Voce nao pode inativar seu proprio usuario." });
      return;
    }

    const user = await updateUserService(idNum, {
      username,
      name,
      role,
      active,
    });
    res.json(user);
  } catch (error: any) {
    if (error?.code === "23505") {
      res.status(409).json({ error: "Login/e-mail ja existe." });
      return;
    }
    console.error("Erro ao atualizar usuario:", error);
    res.status(500).json({ error: "Erro ao atualizar usuario" });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const idNum = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(idNum)) {
    res.status(400).json({ error: "ID invalido." });
    return;
  }

  const { active } = req.body;
  if (typeof active !== "boolean") {
    res.status(400).json({ error: "active deve ser booleano." });
    return;
  }

  if (req.user?.id === idNum && active === false) {
    res.status(400).json({ error: "Voce nao pode inativar seu proprio usuario." });
    return;
  }

  try {
    const user = await updateUserStatusService(idNum, active);
    if (!user) {
      res.status(404).json({ error: "Usuario nao encontrado." });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao atualizar status do usuario:", error);
    res.status(500).json({ error: "Erro ao atualizar status do usuario" });
  }
};

export const resetUserPasswordByAdmin = async (req: Request, res: Response) => {
  const idNum = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(idNum)) {
    res.status(400).json({ error: "ID invalido." });
    return;
  }

  try {
    const result = await resetUserPasswordByAdminService(idNum);
    console.info(
      `[admin] Usuario ${idNum} teve senha redefinida pelo admin ${req.user?.id ?? "desconhecido"}.`,
    );
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "Usuario nao encontrado." });
      return;
    }
    console.error("Erro ao redefinir senha do usuario:", error);
    res.status(500).json({ error: "Erro ao redefinir senha do usuario" });
  }
};

export const getPasswordResetRequests = async (req: Request, res: Response) => {
  const status = req.query["status"];
  const allowedStatuses: PasswordResetRequestStatus[] = [
    "pendente",
    "atendida",
    "cancelada",
  ];
  const statusFilter =
    typeof status === "string" && allowedStatuses.includes(status as PasswordResetRequestStatus)
      ? (status as PasswordResetRequestStatus)
      : undefined;

  try {
    const requests = await getPasswordResetRequestsService(statusFilter);
    res.json(requests);
  } catch (error) {
    console.error("Erro ao listar solicitacoes de senha:", error);
    res.status(500).json({ error: "Erro ao listar solicitacoes de senha" });
  }
};

export const resolvePasswordResetRequest = async (
  req: Request,
  res: Response,
) => {
  const requestId = parseInt(String(req.params["id"] ?? ""), 10);
  const adminId = req.user?.id;

  if (isNaN(requestId)) {
    res.status(400).json({ error: "ID invalido." });
    return;
  }
  if (!adminId) {
    res.status(401).json({ error: "Nao autenticado." });
    return;
  }

  try {
    const result = await resolvePasswordResetRequestService(requestId, adminId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PASSWORD_RESET_REQUEST_NOT_FOUND") {
        res.status(404).json({ error: "Solicitacao nao encontrada." });
        return;
      }
      if (error.message === "PASSWORD_RESET_REQUEST_NOT_PENDING") {
        res.status(400).json({ error: "Solicitacao ja foi finalizada." });
        return;
      }
      if (error.message === "PASSWORD_RESET_REQUEST_WITHOUT_USER") {
        res.status(400).json({
          error:
            "Nao ha usuario ativo associado a este login. Cancele a solicitacao ou cadastre o usuario.",
        });
        return;
      }
    }
    console.error("Erro ao atender solicitacao de senha:", error);
    res.status(500).json({ error: "Erro ao atender solicitacao de senha" });
  }
};

export const cancelPasswordResetRequest = async (
  req: Request,
  res: Response,
) => {
  const requestId = parseInt(String(req.params["id"] ?? ""), 10);
  const adminId = req.user?.id;
  const observacao =
    typeof req.body?.observacao === "string" && req.body.observacao.trim()
      ? req.body.observacao.trim()
      : null;

  if (isNaN(requestId)) {
    res.status(400).json({ error: "ID invalido." });
    return;
  }
  if (!adminId) {
    res.status(401).json({ error: "Nao autenticado." });
    return;
  }

  try {
    const request = await cancelPasswordResetRequestService(
      requestId,
      adminId,
      observacao,
    );
    res.json(request);
  } catch (error) {
    if (error instanceof Error && error.message === "PASSWORD_RESET_REQUEST_NOT_PENDING") {
      res.status(400).json({ error: "Solicitacao ja foi finalizada." });
      return;
    }
    console.error("Erro ao cancelar solicitacao de senha:", error);
    res.status(500).json({ error: "Erro ao cancelar solicitacao de senha" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};

// ─── Logs ──────────────────────────────────────────────────────────────────────
export const updateMyAccount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name } = req.body;

  if (!userId) {
    res.status(401).json({ error: "Nao autenticado." });
    return;
  }

  if (!name) {
    res.status(400).json({ error: "name e obrigatorio." });
    return;
  }

  try {
    const user = await updateMyAccountService(userId, name);
    if (!user) {
      res.status(404).json({ error: "Usuario nao encontrado." });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao atualizar minha conta:", error);
    res.status(500).json({ error: "Erro ao atualizar minha conta" });
  }
};

export const changeMyPassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    res.status(401).json({ error: "Nao autenticado." });
    return;
  }

  if (!currentPassword || !newPassword) {
    res
      .status(400)
      .json({ error: "currentPassword e newPassword sao obrigatorios." });
    return;
  }

  if (String(newPassword).length < 6) {
    res.status(400).json({ error: "A nova senha deve ter pelo menos 6 caracteres." });
    return;
  }

  try {
    await changeMyPasswordService(userId, currentPassword, newPassword);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CURRENT_PASSWORD") {
      res.status(400).json({ error: "Senha atual invalida." });
      return;
    }
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "Usuario nao encontrado." });
      return;
    }
    console.error("Erro ao alterar minha senha:", error);
    res.status(500).json({ error: "Erro ao alterar minha senha" });
  }
};

export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const { limit = "20", offset = "0" } = req.query;

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      return res.status(400).json({
        error: "Parâmetros 'limit' e 'offset' devem ser números válidos.",
      });
    }

    const logs = await getAllLogsService(limitNum, offsetNum);
    res.json(logs);
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    res.status(500).json({ error: "Erro ao buscar logs" });
  }
};

export const getLogsStats = async (req: Request, res: Response) => {
  try {
    const stats = await getLogsStatsService();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de logs:", error);
    res.status(500).json({
      message: "Erro interno ao buscar estatísticas de logs.",
    });
  }
};

export const getSatisfactionStats = async (req: Request, res: Response) => {
  try {
    const stats = await getSatisfactionStatsService();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de satisfação:", error);
    res.status(500).json({
      message: "Erro interno ao buscar estatísticas de satisfação.",
    });
  }
};

export const getInquiryStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getInquiryStatsService();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de perguntas por ID:", error);
    res.status(500).json({
      message: "Erro interno ao buscar estatísticas de perguntas acessadas.",
    });
  }
};

export const getInquiryStatsLeaf = async (_req: Request, res: Response) => {
  try {
    const stats = await getInquiryStatsLeafService();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de perguntas folha:", error);
    res.status(500).json({
      message: "Erro interno ao buscar estatísticas de perguntas folha.",
    });
  }
};
