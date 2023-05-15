import { AuthService } from "../services/auth.service";
import { RequestWithSessionUser } from "../request_with_session_user";
declare const BearerStrategy_base: new (...args: any[]) => any;
export declare class BearerStrategy extends BearerStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(token: string, req: RequestWithSessionUser, done: (error: any, user?: any) => void): Promise<void>;
}
export {};
