import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { User } from 'src/typeorm/user.entity';
import { AuthenticatedUser, RequestWithSessionUser } from '../util/user_interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Profile } from 'passport-42';
export declare class AuthService {
    private readonly userService;
    private readonly configService;
    private readonly jwtService;
    private secret;
    constructor(userService: UsersService, configService: ConfigService, jwtService: JwtService);
    redirectTo42OAuth(res: Response): Promise<void>;
    authenticateUser(code: string, req: RequestWithSessionUser): Promise<User>;
    validateUser(username: string): Promise<User>;
    findOneOrCreate(profile: Profile): Promise<User>;
    generateTwoFactorAuthSecret(user: AuthenticatedUser): Promise<string>;
    displayQrCode(res: Response, otpAuthUrl: string): Promise<void>;
    verifyOtp(otp: string): Promise<boolean>;
    logout(user: AuthenticatedUser): Promise<User>;
    clearUserSession(req: Request): Promise<void>;
    clearUserCookies(res: Response): Promise<void>;
    createPayload(user: AuthenticatedUser): Promise<JwtPayload>;
    createToken(payload: JwtPayload): Promise<string>;
}
