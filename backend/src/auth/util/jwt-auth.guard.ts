import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
//     canActivate(context: ExecutionContext) {
//       return super.canActivate(context);
//     }
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-2fa') {
  
  // async canActivate(context: ExecutionContext): Promise<boolean> {
      // const req: Request = context.switchToHttp().getRequest();
      // console.log('jwt req is authenticated', req.isAuthenticated());
      // return req.isAuthenticated();
      // console.log('here');
      
      // const canActivate = await super.canActivate(context);
      // if (!canActivate) {
      //     return false;
      //   }
      // return true;
  // }


  // handleRequest(err, user, info, context) {
  //     return user;
  // }
}
