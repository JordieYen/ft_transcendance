import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { RequestWithSessionUser } from '../request_with_session_user';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(res: Response): Promise<void>;
    callback(code: string, req: RequestWithSessionUser, res: Response): Promise<void>;
    getAuthSession(session: Record<string, any>): Promise<any[]>;
    getAuthStatus(req: any): Promise<any>;
    findAll(): string;
}
