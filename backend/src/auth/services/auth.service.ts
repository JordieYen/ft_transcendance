import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';
import { User } from 'src/typeorm/user.entity';
import { AuthenticatedUser, RequestWithSessionUser } from '../util/user_interface';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Profile } from 'passport-42';


@Injectable()
export class AuthService {
    private secret: string;
   
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        ) {}
        
    async redirectTo42OAuth(res: Response) {
        const client_id = this.configService.get<string>('CLIENT_ID');
        const redirect_uri = `http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`;
        const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=public`;
        return res.redirect(authorizeUrl);
    }

    async authenticateUser(code: string, req: RequestWithSessionUser) : Promise<User> {

        try {
            const { data: tokenResponse } = await axios.post('https://api.intra.42.fr/oauth/token', {
                grant_type: 'authorization_code',
                client_id: this.configService.get<string>('CLIENT_ID'),
                client_secret: this.configService.get<string>('CLIENT_SECRET'),
                redirect_uri: 'http://localhost:3000/auth/callback',
                code,
            });
            const accessToken = tokenResponse.access_token;
            const refreshToken = tokenResponse.refresh_token;
            req.res.setHeader('Set-Cookie', [
                `refresh_token=${refreshToken}`,
                `access_token=${accessToken}`,
            ]);
            const cookieHeader = req.res.getHeader('Set-Cookie');
            const profileResponse =  await axios.get(
                'https://api.intra.42.fr/v2/me',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                },
                );
            const user = new User();
            user.intra_uid = profileResponse.data.id;
            user.username =  profileResponse.data.login;
            user.avatar = profileResponse.data.image.link;
            user.online = false;
            let existingUser = await this.userService.findUsersByName(user.username);
            if (!existingUser) {
                existingUser = await this.userService.createUser(user);
            }
            req.session.user = existingUser;
            return existingUser;
        } catch (error) {
            if (error.response) {
                console.log('RESPONSE', error.response.data);
            } else if (error.request) {
                console.log('REQUEST', error.request);
            } else {
                console.log('Error', error.message);
            }
        };
    }

    async validateUser(username: string): Promise<User> {
        const user = await this.userService.findUsersByName(username);
        if (user)
            return (user);
        return (null);
    }

    async findOneOrCreate(profile: Profile): Promise<User> {
        let returnUser = await this.userService.findUsersByIntraId(+profile.id);
        if (!returnUser) {
            const newUser = new User(); 
            newUser.intra_uid = +profile.id;
            newUser.username = profile.username;
            newUser.avatar = profile._json.image.link;
            newUser.online = true;
            returnUser = await this.userService.createUser(newUser);
        }
        return (returnUser);
    }

    async generateTwoFactorAuthSecret(user: AuthenticatedUser) : Promise<string> {
        this.secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(user.username, 'MyApp', this.secret);
        return otpAuthUrl;
    }

    async displayQrCode(res: Response, otpAuthUrl: string) : Promise<void> {
        const qrCode = await qrcode.toFileStream(res, otpAuthUrl);
    }

    async verifyOtp(otp: string) {
        return authenticator.check(otp, this.secret)
    }

    async logout(user: AuthenticatedUser) : Promise<User> {
        return await this.userService.updateUser(user.id, { online: false });
    }

    async clearUserSession(req: Request): Promise<void> {
        return await new Promise<void>((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async clearUserCookies(res: Response): Promise<void> {
        res.clearCookie('ft_transcendence_session_id');
        res.clearCookie('jwt');
    }

    async createPayload(user: AuthenticatedUser): Promise<JwtPayload> {
        const payload = {
            sub: user.id.toString(),
            username: user.username,
        }
        return payload;
    }

    async createToken(payload: JwtPayload): Promise<string> {
        const token = await this.jwtService.sign(payload, {
             secret: process.env.JWT_SECRET, 
            });
        return token;
    }

    async getAuthUserProfile(id: number): Promise<User> {
        return await this.userService.findUsersByIdWithRelation(id);
    }
 }
