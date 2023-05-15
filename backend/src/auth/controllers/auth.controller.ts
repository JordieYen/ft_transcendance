import { Controller, Get, Post, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { AuthenticatedGuard, LocalAuthGuard, UserGuard } from '../util/local.guard';
import { JwtAuthGuard } from '../util/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithSessionUser } from '../request_with_session_user';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  // @Get('login')
  // login(@Req() req) {
  //   // The actual login logic is handled by the local auth guard and local strategy
  //   // If the authentication is successful, the user will be available in the request object
  //   return req.user;
  // }

  @Get('login')
  // @UseGuards(AuthGuard('jwt'))
  login(@Res() res: Response) {
    console.log('loging backend');
    return (this.authService.redirectTo42OAuth(res));
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Req() req: RequestWithSessionUser, @Res() res: Response) {
    try {
      const user = await this.authService.authenticateUser(code, req);
      console.log("callback");
      return res.redirect(`http://localhost:3001/pong-main`);
    } catch (error) {
      console.log('---------ERRRRRORRRRR--------');
      console.error(error)
    }
  }
  
  @UseGuards(AuthGuard('bearer'))
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    return [session, session.id];
    // return ({session: session, sessionId: session.id});
  }
  
  
  @UseGuards(UserGuard)
  @Get('status')
  async getAuthStatus(@Req() req) {
    return req.user;
  }
  
  @Get('bearer')
  @UseGuards(UserGuard)
  findAll(): string {
    return 'This route requires authentication';
  }
}
