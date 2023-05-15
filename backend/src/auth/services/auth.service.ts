import { Inject, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { User } from 'src/typeorm/user.entity';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { RequestWithSessionUser } from '../request_with_session_user';

@Injectable()
export class AuthService {
    constructor(
        // @Inject(REQUEST) private readonly myRequest: Request,
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
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
            // Set the access token as a cookie
            // req.res.setHeader('Set-Cookie', [
            //   accessToken,
            //   refreshToken,
            // ]);
            req.res.setHeader('Set-Cookie', [
                `refresh_token=${refreshToken}`,
                `access_token=${accessToken}`,
            ]);
            const cookieHeader = req.res.getHeader('Set-Cookie');
            console.log('req response', cookieHeader);
            // console.log('Response', tokenResponse);
            // console.log(accessToken);
            // console.log(refreshToken);
            const profileResponse =  await axios.get(
                'https://api.intra.42.fr/v2/me',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                },
                );
            // console.log('Profile reposnze data', profileResponse.headers);
            const user = new User();
            user.intra_uid = profileResponse.data.id;
            user.username =  profileResponse.data.login;
            user.avatar = profileResponse.data.image.link;
            user.online = false;
            
            // console.log('users info', user);
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

    async login(user: any) {
        const payload = { name: user.name, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
