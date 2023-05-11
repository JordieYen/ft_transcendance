import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import axios from 'axios';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    async redirectTo42OAuth(res: Response) {
        const client_id = this.configService.get<string>('CLIENT_ID');
        const redirect_uri = `http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`;
        const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=public`;
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.redirect(authorizeUrl);
        // Proxy the request to the API
        // const proxyResponse = await this.httpService.get(authorizeUrl).toPromise();
        // const redirectedUrl = proxyResponse.request.res.responseUrl;
        // console.log('redirectedUrl', redirectedUrl);
        
        // return res.redirect(redirectedUrl);
    }

    async authenticateUser(code: string) : Promise<User> {

        try {
            const { data: tokenResponse } = await axios.post('https://api.intra.42.fr/oauth/token', {
                grant_type: 'authorization_code',
                client_id: this.configService.get<string>('CLIENT_ID'),
                client_secret: this.configService.get<string>('CLIENT_SECRET'),
                redirect_uri: 'http://localhost:3000/auth/callback',
                code,
            });
    
            // const accessToken = response.data.access_token;
            const accessToken = tokenResponse.access_token;
            console.log(accessToken);

            const profileResponse =  await axios.get(
                'https://api.intra.42.fr/v2/me',
                {
                    headers: {Authorization: `Bearer ${accessToken}`},
                },
                );
            console.log('Profile reposnze data', profileResponse.data);
            const user = new User();
            user.intra_uid = profileResponse.data.id;
            user.username =  profileResponse.data.login;
            user.avatar = profileResponse.data.image.link;
            user.online = false;
            console.log('users info', user);
            const existingUser = await this.userService.findUsersByName(user.username);
            if (existingUser)
                return (existingUser);
            else
            {
                console.log('CREATE USER');
                
                return await this.userService.createUser(user);
            } 
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
}
