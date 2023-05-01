import { HttpService } from '@nestjs/axios/dist/http.service';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @Get('42')
  redirectTo42OAuth(@Res() res: Response) {
    return this.authService.redirectTo42OAuth(res);
  }
}
