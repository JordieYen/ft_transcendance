import { Body, Controller, Get, Logger, Param, Post, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from '../util/local.guard';
import { AuthenticatedUser, RequestWithSessionUser } from '../util/user_interface';
import { FortyTwoAuthGuard } from '../util/42-auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import { InvalidOtpException } from '../util/invalid_otp_exception';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { User as userEntity } from 'src/typeorm/user.entity';
import session from 'express-session';
import { JwtAuthGuard } from '../util/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/services/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // Using 42 Passport
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({
    summary: 'login to start your pong game',
  })

  @Get('login')
  async login() {
  }

  // req.user contains token
  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) : Promise<void> {
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

  // @UseGuards(AuthenticatedGuard)
  @Get('2fa')
  async enableTwoFactorAuth(@Req() req: Request, @Res() res: Response) : Promise<void> {
    const otpAuthUrl = await this.authService.generateTwoFactorAuthSecret(req.user);
    await this.authService.displayQrCode(res, otpAuthUrl);
  }

  // JWT containe Header, Payload, Signature
  // @UseGuards(AuthenticatedGuard)
  @Post('otp')
  async verifyOtp(@Req() req: Request, @Res() res: Response, @Body() body: { otp: string }) {
    const isValid = await this.authService.verifyOtp(body.otp);
    if (isValid) {
      const payload = await this.authService.createPayload(req.user);
      const token = await this.authService.createToken(payload);
      res.setHeader('Authorization', `Bearer ${token}`);
      return res.send(token);
    }
    throw new InvalidOtpException();
  }
  
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) : Promise<Record<string, any> > {
    return await [session, session.id];
    // return ({session: session, sessionId: session.id});
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt-2fa'))
  @Get('jwt')
  async getJwt() {
    return { msg: 'enter jwt guard'};
  }
  
  // @UseGuards(AuthenticatedGuard)
  @Get('profile')
  async getProfile(@User() user) {
      const returnUser = await this.authService.getAuthUserProfile(user.id);
      return await returnUser;
  }
  // @Get('profile')
  // async getProfile(@User() user) {
  //     return await user;
  // }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      await this.authService.logout(req.user);
      await this.authService.clearUserSession(req);
      await this.authService.clearUserCookies(res);
      req.logout(() => {});
    }
    res.json({ message: 'User logout' });
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
