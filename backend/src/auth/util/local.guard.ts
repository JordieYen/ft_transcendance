import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        console.log('req is authenticated', req.isAuthenticated());
        return req.isAuthenticated();
    }

    // async canActivate(context: ExecutionContext) : Promise<boolean> {
    //     const req = context.switchToHttp().getRequest();
    //     if (req?.user) {
    //         return true;
    //     }
    //     const sessionID: string = req.sessionID;
    //     const session = await this.sessionRepository.findOne({ where: {id: sessionID }});
    //     if (session) {
    //         const sessionData = JSON.parse(session.json);
    //         const user = sessionData.user;
    //         req.user = user;
    //         req.session.user = user;
    //         req.isAuthenticated = true;
    //         return(true);
    //     }
    //     return false;
    // }
}
