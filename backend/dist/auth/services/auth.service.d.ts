import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { User } from 'src/typeorm/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RequestWithSessionUser } from '../request_with_session_user';
export declare class AuthService {
    private readonly userService;
    private readonly configService;
    private readonly httpService;
    private readonly jwtService;
    constructor(userService: UsersService, configService: ConfigService, httpService: HttpService, jwtService: JwtService);
    redirectTo42OAuth(res: Response): Promise<void>;
    authenticateUser(code: string, req: RequestWithSessionUser): Promise<User>;
    validateUser(username: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
