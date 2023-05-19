import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { VerifyCallback } from "passport-jwt";
// import { Strategy } from 'passport-42';
import { User } from "src/typeorm/user.entity";
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { AuthService } from "../services/auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService

    ) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.AUTH_CALLBACK,
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile, 
        done: VerifyCallback
    ) : Promise<any> {
        const user: Partial<any> = {
            intra_uid : profile.id,
            username : profile.username,
            avatar : profile._json.image.link,
            online: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        const existingUser = await this.authService.findOneOrCreate(user);
        const newUser = {
            ...user,
            ...existingUser,
        };
        done(null, newUser);
        // profile.accessToken = accessToken;
        // profile.refreshToken = refreshToken;        
        // done(null, profile);        
    }
}
