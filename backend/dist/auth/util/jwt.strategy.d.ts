import { Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: any): Promise<import("../../typeorm/user.entity").User>;
}
export {};
