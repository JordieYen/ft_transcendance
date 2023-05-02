import { HttpService } from '@nestjs/axios/dist/http.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly httpService;
    private readonly configService;
    private readonly authService;
    constructor(httpService: HttpService, configService: ConfigService, authService: AuthService);
    login(res: Response): void;
    callback(code: string, res: Response): Promise<void>;
}
