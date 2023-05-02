import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Users } from 'src/typeorm/users.entity';
import { HttpService } from '@nestjs/axios';


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

    redirectTo42OAuth(res: Response) {
        const client_id = this.configService.get<string>('CLIENT_ID');
        // const clientSecret = this.configService.get<string>('CLIENT_SECRET');
        // const client_id = 'u-s4t2ud-u-s4t2ud-134d3bd57fda8066d5380d71a2d111f5fceab951ecb10cf1b88f9ea3994278b4';
        // const redirect_uri = `${res.protocol}://${req.get('host')}/auth/42/callback`;
        const redirect_uri = 'http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback';

        const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=public`;
        return res.redirect(authorizeUrl);
    }

    async authenticateUser(code: string) : Promise<Users> {

        const response = await this.httpService.post(
            'https://api.intra.42.fr/oauth/token',
            {
                grant_type: 'authorization_code',
                client_id: this.configService.get<string>('CLIENT_ID'),
                client_secret: this.configService.get<string>('CLIENT_SECRET'),
                code,
                redirect_uri: 'http://localhost:3000/auth/callback',

            },
        ).toPromise();

        const accessToken = response.data.access_token;
        const profileResponse =  await this.httpService.get(
            'https://api.intra.42.fr/v2/me',
            {
                headers: {Authorization: `Bearer ${accessToken}`},
            },
        ).toPromise();

        const user = new Users();
        user.email = profileResponse.data.email;
        user.username =  profileResponse.data.username;
        // const tokens = await this.authService.signIn(intra_data.data.login);
        console.log(user.username);
        return (user);
    }
}
