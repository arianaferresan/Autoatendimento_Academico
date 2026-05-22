import bcrypt from 'bcrypt';
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
  getAllSecretariaUsers,
  createSecretariaUser,
  deleteUserById,
  getAllLogs,
} from "@/repos/adminRpository.js";

interface UpdateNodeData {
  parent_id: number | null;
  title: string;
  content: string | null;
  display_order: number;
  link: string | null;
  is_active: boolean;
  new_chunk_path: string | null;
}

interface CreateNodeData {
  parent_id: number | null;
  title: string;
  content: string | null;
  display_order: number;
  link: string | null;
  is_active: boolean;
  chunk_path: string | null;
}

interface SupportContact {
  id: number;
  email: string;
  message: string;
  status: "ABERTA" | "ATENDIMENTO" | "RESPONDIDA";
  created_at: Date;
  closed_at: Date | null;
  answered_by: string | null;
}

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

export const getAllSupportContactsService = async (): Promise<
  SupportContact[]
> => {
  const contacts = await getSupportContactAll();
  return contacts;
};

export const updateSupportContactByIdService = async (
  id: number,
  status: SupportContact["status"],
  answered_by: string | null,
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

export const getAllLogsService = async () => {
  return getAllLogs();
};
