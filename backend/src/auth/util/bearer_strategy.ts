import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { Strategy } from 'passport-http-bearer';
import { RequestWithSessionUser } from "../request_with_session_user";
import { Request } from "express";

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  
  constructor(private readonly authService: AuthService) {
    console.log('bearer strategy CUSTOMMMMM ');
    super(); 
  }

  async validate(token: string, req: RequestWithSessionUser, done: (error: any, user?: any) => void) {
    console.log('BEARER STRATEGY VALIDATE');
    console.log('token', token);
    
    
    const user = await this.authService.authenticateUser(token, req);
    console.log('user', user);
    
    if (!user) {
      return done('Invalid token', false);
    }
    return done(null, user);
  }

  // async authenticate(context: ExecutionContext, token: string) {
  //   const req = context.switchToHttp().getRequest();
  //   const user = await this.authService.authenticateUser(token);

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid token');
  //   }

  //   req.user = user;
  //   return user;
  // }
 
}
