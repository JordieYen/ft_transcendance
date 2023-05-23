import { Strategy } from "passport-jwt";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "src/typeorm/user.entity";
import { UsersService } from "src/users/services/users.service";
declare const Jwt2faStrategy_base: new (...args: any[]) => Strategy;
export declare class Jwt2faStrategy extends Jwt2faStrategy_base {
    readonly userService: UsersService;
    constructor(userService: UsersService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
