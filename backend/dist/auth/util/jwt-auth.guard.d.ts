import { ExecutionContext } from "@nestjs/common";
import { IAuthGuard } from "@nestjs/passport";
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
