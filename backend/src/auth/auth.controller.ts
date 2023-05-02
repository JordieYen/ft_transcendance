import { HttpService } from '@nestjs/axios/dist/http.service';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
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

  @Get('login')
  login(@Res() res: Response) {
    return this.authService.redirectTo42OAuth(res);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const user = await this.authService.authenticateUser(code);
      return res.redirect('/');
    } catch (error) {
      console.error(error)
    }
  }
}
