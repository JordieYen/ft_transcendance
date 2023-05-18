import { Body, Controller, Get, Logger, Post, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from '../util/local.guard';
import { RequestWithSessionUser } from '../util/request_with_session_user';
import { FortyTwoAuthGuard } from '../util/42-auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import { InvalidOtpException } from '../util/invalid_otp_exception';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // Using 42 Passport
  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  async login() {
  }

  // req.user contains token
  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  async callback(@Req() req , @Res() res: Response) {

    console.log('req.user', req.user);
    const accessToken = req.user.accessToken;
    const refreshToken = req.user.refreshToken;
    const existingUser = await this.authService.findOneOrCreate(req.user);
    console.log('existin user', existingUser);
    
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.user = existingUser;
    console.log('req.user after', req.user);
    console.log('req session', req.session);
    console.log('req session user', req.session.user);
    
    return res.redirect(`${process.env.NEXT_HOST}/pong-main`);
  }

  // enable google authenticator
  // generate API credentials (client id and secret)
  // secret key is used for generating OTP codes
  // QR code generation contain URL with user's secret and info.
  // display Qr code to user, user can with google authenticator app
  // from app, get 6 digit OTP
  // prompt enter OTP
  // compare user entered with generated OTP
  // if match, user authnticated.

  // @UseGuards(FortyTwoAuthGuard)
  @Get('2fa')
  async enableTwoFactorAuth(@Req() req: RequestWithSessionUser, @Res() res: Response) {
    const otpAuthUrl = await this.authService.generateTwoFactorAuthSecret(req.user);
    console.log('2fa', req.user);
    await this.authService.displayQrCode(res, otpAuthUrl);
  }

  @Post('otp')
  async verifyOtp(@Req() req: RequestWithSessionUser, @Body() body: { otp: string }) {
    console.log('user', req.user);
    console.log('res session', req.session.user);
    console.log('secret: ', process.env.JWT_SECRET);
    const isValid = await this.authService.verifyOtp(body.otp);
    if (isValid) {
      const payload = {
        sub: 'shawn',
      };
      const token = this.jwtService.sign(payload, { secret: 'secret' });
      return token;
    }
    throw new InvalidOtpException();
  }
  
  @UseGuards(AuthenticatedGuard)
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    return [session, session.id];
    // return ({session: session, sessionId: session.id});
  }
  
  // @UseGuards(AuthenticatedGuard)
  // @Get('profile')
  // async getProfile(@User() user: RequestWithSessionUser) {
  //     console.log(user);
  //     return user;
  // }
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithSessionUser) {
      console.log('profile session', req.session.user);
      console.log('profile user', req.user);
      return req.session.user;
  }

  @Get('logout')
  logout(@Req() req) {
      req.user = null;
      req.session.user = null;
      req.session.destroy();
      return {
        msg: 'The user session has ended. '
      }
  }

  // Manual approach
  // @Get('login')
  // login(@Res() res: Response) {
  //   console.log('loging backend');
  //   return (this.authService.redirectTo42OAuth(res));
  // }
    
  // @Get('callback')
  // async callback(@Query('code') code: string, @Req() req: RequestWithSessionUser, @Res() res: Response) {
  //   try {
  //     console.log(req.user);
  //     const user = await this.authService.authenticateUser(code, req);
  //     console.log("callback");
  //     return res.redirect(`http://localhost:3001/pong-main`);
  //   } catch (error) {
  //     console.log('---------ERRRRRORRRRR--------');
  //     console.error(error)
  //   }
  // }
}
