import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "src/typeorm/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
        console.log('jwt strategy', process.env.JWT_SECRET);
    }

    async validate(payload: JwtPayload): Promise<any> {
        // Validate and retrieve user information from the payload (e.g., by calling the AuthService)
        console.log('payload', payload);
        return await { id: payload.sub, username: payload.username };
        // return await this.authService.validateUser(payload.username);
    }
}
