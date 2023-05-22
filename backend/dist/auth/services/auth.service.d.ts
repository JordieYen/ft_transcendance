import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from 'src/typeorm/user.entity';
import { RequestWithSessionUser } from '../request_with_session_user';
export declare class AuthService {
    private readonly userService;
    private readonly configService;
    private secret;
    constructor(userService: UsersService, configService: ConfigService);
    redirectTo42OAuth(res: Response): Promise<void>;
    authenticateUser(code: string, req: RequestWithSessionUser): Promise<User>;
    validateUser(username: string): Promise<any>;
    findOneOrCreate(user: any): Promise<User>;
    generateTwoFactorAuthSecret(user: any): Promise<string>;
    displayQrCode(res: Response, otpAuthUrl: string): Promise<void>;
    verifyOtp(otp: string): Promise<boolean>;
}
