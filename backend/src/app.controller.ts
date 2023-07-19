import { Controller, Get, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller('api')
@ApiTags('Api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('success')
  getSuccesslogin(): string {
    return this.appService.getSuccesslogin();
  }
  @Get('check-session')
  checkSession(@Req() req: Request) {
    const sessionId = req.sessionID;
    if (sessionId) return `Session ID: ${sessionId}`;
    else return 'No session ID found';
  }

  @Get('auth/callback/42-school')
  callback42() {
    return this.appService.getSuccesslogin();
  }
}
