import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist/http.service';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    private readonly httpService;
    constructor(authService: AuthService, configService: ConfigService, httpService: HttpService);
    login(res: Response): Promise<void>;
    callback(code: string, req: Request, res: Response): Promise<void>;
}
