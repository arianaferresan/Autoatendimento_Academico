import type { Request, Response } from "express";
export declare const getPublicNodes: (req: Request<{
    id?: string;
}>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteALL: (_req: Request, res: Response) => Promise<void>;
export declare const createSupportContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createFulfillmentLog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=publicController.d.ts.map