import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Users } from 'src/typeorm/users.entity';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findUsersByName(username);
        if (user && compareSync(password, user.password)) {
            const { password, ...result } =  user;
            return (result);
        }
        return (null);
    }

    async redirectTo42OAuth(res: Response) {
        const client_id = this.configService.get<string>('CLIENT_ID');
        const redirect_uri = `http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`;
        const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=public`;
        // return res.redirect(authorizeUrl);
        const response = await axios.post(authorizeUrl);
        console.log('response...', response.data);
        
        res.redirect(response.data);
    }

    async authenticateUser(code: string) : Promise<Users> {

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
            console.log('Profile reposnze', profileResponse);
            const user = new Users();
            user.email = profileResponse.data.email;
            user.username =  profileResponse.data.login;
            user.boolean = true;
            user.role = 'user';
            user.password = profileResponse.data.login;
            console.log(user.username);
            console.log(user.email);
            const existingUser = await this.userService.findUsersByEmail({ email: user.email });
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
