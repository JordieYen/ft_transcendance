import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { VerifiedCallback } from "passport-jwt";
import { Strategy } from 'passport-42';
import { SessionSerializer } from "./session_serializer";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
    constructor(
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
        profile: any, 
        done: VerifiedCallback
    ) : Promise<any> {
        const user: Partial<any> = {
            intra_uid : profile.id,
            username : profile.username,
            avatar : profile._json.image.link,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        done(null, user);        
    }
}
