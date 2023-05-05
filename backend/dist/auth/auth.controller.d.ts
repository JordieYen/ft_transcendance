import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(res: Response): void;
    callback(code: string, res: Response): Promise<void>;
}
