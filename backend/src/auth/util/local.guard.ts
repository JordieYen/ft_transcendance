import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { AuthService } from "../services/auth.service";

@Injectable()
// export class UserGuard extends AuthGuard('bearer') implements CanActivate {
export class AuthenticatedGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        ) 
        {
    }

    async canActivate(context: ExecutionContext) : Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        if (req?.user)
            return true;
        return false;
    }
}
