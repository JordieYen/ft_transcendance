import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { VerifyCallback } from "passport-jwt";
// import { Strategy } from 'passport-42';
import { User } from "src/typeorm/user.entity";
import { Strategy, StrategyOptions, Profile, VerifyCallback } from 'passport-42';
import { AuthService } from "../services/auth.service";
import { AuthenticatedUser } from "./user_interface";
import { UsersService } from "src/users/services/users.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.AUTH_CALLBACK,
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
        let authUser = await this.authService.findOneOrCreate(profile);
    if (!authUser.online)
            authUser = await this.userService.updateUser(authUser.id, { online: true });
        done(null, authUser);
    }

    // async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    //     const user: AuthenticatedUser = {
    //         id: null,
    //         intra_uid : profile.id,
    //         username : profile.username,
    //         avatar : profile._json.image.link,
    //         online: true,
    //         accessToken: accessToken,
    //         refreshToken: refreshToken,
    //     };
    //     let existingUser = await this.authService.findOneOrCreate(profile);
    //     if (!existingUser.online)
    //         existingUser = await this.userService.updateUser(existingUser.id, { online: true });
    //     const newUser = {
    //             ...user,
    //             ...existingUser,
    //         };
    //     done(null, newUser);
    // }
}
