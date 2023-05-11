import { Controller, Get, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist/http.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  @Get('login')
  login(@Res() res: Response) {
    console.log('loging backend');
    return (this.authService.redirectTo42OAuth(res));
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.authenticateUser(code, req);
      console.log("callback");
      // return (res.redirect('http://localhost:3000/success'));
      return (res.redirect(`http://localhost:3001/pong-main?userId=${user.id}`));
    } catch (error) {
      console.log('---------ERRRRRORRRRR--------');
      console.error(error)
    }
  }
}
