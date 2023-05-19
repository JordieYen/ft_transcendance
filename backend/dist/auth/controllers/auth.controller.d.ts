import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { RequestWithSessionUser } from '../util/request_with_session_user';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(): Promise<void>;
    callback(req: any, res: Response): Promise<void>;
    enableTwoFactorAuth(req: RequestWithSessionUser, res: Response): Promise<void>;
    verifyOtp(req: any, body: {
        otp: string;
    }): Promise<string>;
    getAuthSession(session: Record<string, any>): Promise<any[]>;
    getProfile(user: any): Promise<any>;
    logout(req: Request): Promise<{
        msg: string;
    }>;
}
