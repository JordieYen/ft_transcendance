import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Users } from 'src/typeorm/users.entity';
import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly userService;
    private readonly configService;
    private readonly httpService;
    constructor(userService: UsersService, configService: ConfigService, httpService: HttpService);
    validateUser(username: string, password: string): Promise<any>;
    redirectTo42OAuth(res: Response): Promise<void>;
    authenticateUser(code: string): Promise<Users>;
}
