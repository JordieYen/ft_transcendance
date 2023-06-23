import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
//     canActivate(context: ExecutionContext) {
//       return super.canActivate(context);
//     }
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-2fa') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate: boolean = (await super.canActivate(context)) as boolean;
    const request: Request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
