import { Controller, Get, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
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

  // @Get('login')
  // async login(@Res() res: Response) {
  //   try {
  //     console.log('logining...');
      
  //     const response = await axios.get(`https://api.intra.42.fr/oauth/authorize`, {
  //       params: {
  //         client_id: this.configService.get<string>('CLIENT_ID'),
  //         redirect_uri: `http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`,
  //         response_type: 'code',
  //         scope: 'public',
  //       },
  //     });
  //     console.log('response...', response.data);
  //     res.redirect(response.data);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('An error occurred');
  //   }
  // }

  @Get('loginpage')
  loginPage(@Res() res: Response) {
    // return (res.sendFile('login.html', { root: 'frontend'}));
    // return res.sendFile('login.html', { root: join(__dirname, '..', '..', '..', 'frontend', 'src') });
    return res.sendFile('login.tsx', { root: join(__dirname, '..', '..', '..', 'frontend/src') });
  }

  @Get('loginpagetsx')
  loginPageTsx(@Res() res: Response) {
    return res.redirect('http://localhost:3000/auth/login');
  }


  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const user = await this.authService.authenticateUser(code);
      console.log("callback");
      // return (res.redirect('http://localhost:3000/success'));
      return (res.redirect('http://localhost:3001/pong-main'));
    } catch (error) {
      console.log('---------ERRRRRORRRRR--------');
      console.error(error)
    }
  }
}
