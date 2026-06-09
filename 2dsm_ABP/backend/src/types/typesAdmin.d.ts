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
    answered_by: number | null;
}
interface FullfillmentLog {
    session_id: string;
    navigation_flow: object[];
    inquiry_ids: number[];
    flag: "ÓTIMO" | "BOM" | "MUITO BOM" | "SATISFATÓRIO" | "RUIM";
    created_at: Date;
}
type LogStat = {
    month: string;
    category: string;
    log_count: number;
};
type SupportContactStat = {
    status: SupportContact["status"];
    count: number;
};
type InquiryStat = {
    month: string;
    inquiry_id: number;
    title: string;
    count: number;
};
type SatisfactionStat = {
    month: string;
    flag: string | null;
    count: number;
};
type Node = {
    id: number;
    parent_id: number | null;
    title: string;
    content: string | null;
    display_order: number;
    chunk_path: string | null;
    link: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
};
interface NodesParams {
    id: string;
}
export type { FullfillmentLog, SupportContact, UpdateNodeData, CreateNodeData, Node, NodesParams, LogStat, SupportContactStat, InquiryStat, SatisfactionStat, };
//# sourceMappingURL=typesAdmin.d.ts.map