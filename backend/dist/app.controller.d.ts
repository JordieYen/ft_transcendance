import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    constructor(appService: AppService, configService: ConfigService);
    getHello(): string;
    getSuccesslogin(): string;
    checkSession(req: Request): string;
}
