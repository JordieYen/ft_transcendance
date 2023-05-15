import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { UsersService } from "src/users/services/users.service";
import { RequestWithSessionUser } from "../request_with_session_user";
import { AuthService } from "../services/auth.service";
import { BearerStrategy } from "./bearer_strategy";
import { LocalStrategy } from "./local_strategy";
import { parse } from 'cookie';


function getCookiesFromHeader(cookieHeader: string): Record<string, string> {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    const cookieData = cookies.reduce((data, cookie) => {
        const [key, value] = cookie.split('=');
        data[key] = value;
        return (data);
    }, {});
    return cookieData;
}


@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<any> {
        console.log('enter local auth guard');
        const result = (await super.canActivate(context)) as boolean;
        console.log('AuthGuard result:', result);
        const request = context.switchToHttp().getRequest();
        console.log('HTTP Request:', request);
        await super.logIn(request);
        console.log('User logged in');
        return (result);
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest<Request>();
        return req.isAuthenticated();
    }
}

@Injectable()
// export class UserGuard extends AuthGuard('bearer') implements CanActivate {
export class UserGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        ) 
        {
        // super();
    }

    async canActivate(context: ExecutionContext) : Promise<boolean> {
        console.log('user guard start');
        const req : RequestWithSessionUser = context.switchToHttp().getRequest();
        const cookieHeader = req.headers.cookie;
        const cookies = getCookiesFromHeader(cookieHeader);
        // console.log('req res', req.res);
        // console.log('cookieData', cookies);
        // console.log('user in local', req.session.user);
        if (req?.user)
        {
            const user = await this.usersService.findUsersById(req.session.user.id);
            req.user = user;
            return true;
        }
        return false;
    }
}
