import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/typeorm/user.entity";
import { UsersService } from 'src/users/services/users.service';
export declare class SessionSerializer extends PassportSerializer {
    private readonly userService;
    constructor(userService: UsersService);
    serializeUser(user: User, done: (err: any, user: User) => void): void;
    deserializeUser(user: User, done: (err: any, user: User) => void): Promise<void>;
}
