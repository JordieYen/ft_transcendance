import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { RequestWithSessionUser } from '../request_with_session_user';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(): Promise<void>;
    callback(req: any, res: Response): Promise<void>;
    enableTwoFactorAuth(req: RequestWithSessionUser, res: Response): Promise<void>;
    verifyOtp(req: RequestWithSessionUser, body: {
        otp: string;
    }): Promise<string>;
    getAuthSession(session: Record<string, any>): Promise<any[]>;
    getProfile(user: RequestWithSessionUser): Promise<RequestWithSessionUser>;
    logout(req: any): {
        msg: string;
    };
}
