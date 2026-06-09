import type { Request, Response, NextFunction } from "express";
import type { JwtPayload, UserRole } from "../types/types.js";
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function authorize(...roles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map