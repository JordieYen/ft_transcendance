import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { AuthService } from "../services/auth.service";
import { Repository } from "typeorm";
import { SessionEntity } from "src/typeorm/session.entity";
export declare class AuthenticatedGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    private sessionRepository;
    constructor(authService: AuthService, usersService: UsersService, sessionRepository: Repository<SessionEntity>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
