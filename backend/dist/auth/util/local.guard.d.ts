import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { AuthService } from "../services/auth.service";
export declare class AuthenticatedGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
