import type { JwtPayload } from "../types/types.js";
export declare function authenticateUser(username: string, password: string): Promise<{
    token: string;
    user: JwtPayload;
}>;
//# sourceMappingURL=authService.d.ts.map