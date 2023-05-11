import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { User } from 'src/typeorm/user.entity';
export declare class AuthService {
    private readonly userService;
    private readonly configService;
    private readonly httpService;
    constructor(userService: UsersService, configService: ConfigService, httpService: HttpService);
    redirectTo42OAuth(res: Response): Promise<void>;
    authenticateUser(code: string, req: Request): Promise<User>;
}
