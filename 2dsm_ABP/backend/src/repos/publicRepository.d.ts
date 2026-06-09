type NodeOption = {
    id: number;
    title: string;
    display_order: number;
};
type NodeAnswer = {
    title: string;
    content: string | null;
    chunk_path: string | null;
    link: string | null;
};
declare function deleteAllNodes(): Promise<import("pg").QueryResult<any>>;
declare function getNodesByParentId(parentId: number | null): Promise<NodeOption[]>;
declare function getLeafNodeById(id: number): Promise<NodeAnswer | undefined>;
declare function createSupportContact(email: string, message: string): Promise<void>;
export { deleteAllNodes, getNodesByParentId, getLeafNodeById, createSupportContact, };
export type { NodeOption, NodeAnswer };
//# sourceMappingURL=publicRepository.d.ts.map