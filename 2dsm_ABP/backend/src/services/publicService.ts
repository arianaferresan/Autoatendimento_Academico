import {
  getNodesByParentId,
  getLeafNodeById,
  deleteAllNodes,
  createSupportContact,
} from "@/repos/publicRepository.js";
import type { NodeAnswer } from "@/repos/publicRepository.js";

type NavigationResponse =
  | {
      type: "menu";
      options: { id: number; title: string; display_order: number }[];
    }
  | { type: "answer"; data: NodeAnswer }
  | null;

export async function getNavigationNodeService(
  nodeId: number | null,
): Promise<NavigationResponse> {
  // 1. Try to get children for the current node ID.
  const children = await getNodesByParentId(nodeId);

  // 2. If there are children, it's a menu.
  if (children.length > 0) {
    return {
      type: "menu",
      options: children,
    };
  }

  // 3. If there are no children AND we are not at the root (nodeId is not null),
  // it must be a leaf node (an answer).
  if (children.length === 0 && nodeId) {
    const leafNode = await getLeafNodeById(nodeId);

    if (leafNode) {
      return {
        type: "answer",
        data: leafNode,
      };
    }
  }

  // 4. If no children and no leaf node found (or we are at root with no children), return null.
  return null;
}

export async function deleteAllNodesService() {
  await deleteAllNodes();
}

export const createSupportContactService = async (
  email: string,
  message: string,
) => {
  await createSupportContact(email, message);
};
