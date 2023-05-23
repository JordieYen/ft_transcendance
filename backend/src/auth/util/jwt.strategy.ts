import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "src/typeorm/user.entity";
import { Injectable, ParseIntPipe } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: JwtPayload) {
        return await this.userService.findUsersById(+payload.sub);
    }
}
