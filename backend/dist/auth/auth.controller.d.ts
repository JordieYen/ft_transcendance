import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(res: Response): Promise<void>;
    loginPage(res: Response): void;
    loginPageTsx(res: Response): void;
    callback(code: string, res: Response): Promise<void>;
}
