import { getNodesByParentId, getLeafNodeById, deleteAllNodes, createSupportContact, } from "@/repos/publicRepository.js";
export async function getNavigationNodeService(nodeId) {
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
export const createSupportContactService = async (email, message) => {
    await createSupportContact(email, message);
};
//# sourceMappingURL=publicService.js.map