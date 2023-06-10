import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { RequestWithSessionUser } from '../util/user_interface';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(): Promise<void>;
    callback(req: Request, res: Response): Promise<void>;
    enableTwoFactorAuth(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response, body: {
        otp: string;
    }): Promise<Response<any, Record<string, any>>>;
    getAuthSession(session: Record<string, any>): Promise<Record<string, any>>;
    getProfile(user: RequestWithSessionUser): Promise<RequestWithSessionUser>;
    logout(req: Request, res: Response): Promise<void>;
}
