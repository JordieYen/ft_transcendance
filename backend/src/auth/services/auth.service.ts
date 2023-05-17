import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import axios from 'axios';
import { User } from 'src/typeorm/user.entity';
import { RequestWithSessionUser } from '../request_with_session_user';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
    private secret: string;
   
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
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
                console.log('CREATE USER');
                existingUser = await this.userService.createUser(user);
            }
            req.session.user = existingUser;
            console.log(req.session.user);
            return existingUser;
        } catch (error) {
            if (error.response) {
                console.log('RESPONSE', error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log('REQUEST', error.request);
            } else {
                console.log('Error', error.message);
            }
        };
    }

    async validateUser(username: string): Promise<any> {
        const user = await this.userService.findUsersByName(username);
        if (user)
            return (user);
        return (null);
    }

    async findOneOrCreate(user: any): Promise<User> {
        let existingUser = this.userService.findUsersById(user.id);        
        if (!existingUser)
            this.userService.createUser(user);
        return (existingUser);
    }

    async generateTwoFactorAuthSecret(user: any) : Promise<string> {
        this.secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(user.username, 'MyApp', this.secret);
        return otpAuthUrl;
    }

    async displayQrCode(res: Response, otpAuthUrl: string) : Promise<void> {
        const qrCode = await qrcode.toFileStream(res, otpAuthUrl);
    }

    async verifyOtp(otp: string) {
        console.log('otp', otp);
        console.log('secret', this.secret);
        return authenticator.check(otp, this.secret)
    }

 }
