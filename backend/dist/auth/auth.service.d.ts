import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class AuthService {
    private readonly userService;
    private readonly configService;
    constructor(userService: UsersService, configService: ConfigService);
    validateUser(username: string, password: string): Promise<any>;
    redirectTo42OAuth(res: Response): void;
    login(user: any): Promise<void>;
}
