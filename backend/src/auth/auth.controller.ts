import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, request, Response } from 'express';
import { join } from 'path';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('login')
  login(@Res() res: Response) {
    return (this.authService.redirectTo42OAuth(res));
  }

  @Get('loginpage')
  loginPage(@Res() res: Response) {
    // return (res.sendFile('login.html', { root: 'frontend'}));
    return res.sendFile('login.html', { root: join(__dirname, '..', '..', '..', 'frontend') });
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const user = await this.authService.authenticateUser(code);
      console.log("callback");
      return (res.redirect('http://localhost:3000/success'));
    } catch (error) {
      console.log('---------ERRRRRORRRRR--------');
      console.error(error)
    }
  }
}
