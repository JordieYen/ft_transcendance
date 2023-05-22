import { Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";
import { JwtPayload } from 'jsonwebtoken';
declare const Jwt2faStrategy_base: new (...args: any[]) => Strategy;
export declare class Jwt2faStrategy extends Jwt2faStrategy_base {
    readonly authService: AuthService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<any>;
}
export {};
