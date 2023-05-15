import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { AuthService } from "../services/auth.service";
declare const LocalAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LocalAuthGuard extends LocalAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<any>;
}
export declare class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<any>;
}
export declare class UserGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
