import type { NodeAnswer } from "@/repos/publicRepository.js";
type NavigationResponse = {
    type: "menu";
    options: {
        id: number;
        title: string;
        display_order: number;
    }[];
} | {
    type: "answer";
    data: NodeAnswer;
} | null;
export declare function getNavigationNodeService(nodeId: number | null): Promise<NavigationResponse>;
export declare function deleteAllNodesService(): Promise<void>;
export declare const createSupportContactService: (email: string, message: string) => Promise<void>;
export {};
//# sourceMappingURL=publicService.d.ts.map