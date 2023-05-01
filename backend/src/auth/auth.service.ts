import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (user && compareSync(password, user.password)) {
            const { password, ...result } =  user;
            return (result);
        }
        return (null);
    }

    redirectTo42OAuth(res: Response) {
        // const client_id = this.configService.get<string>('CLIENT_ID');
        const client_id = 'u-s4t2ud-ea5c114e4dc7cfb1b6b828ad3a2663fc86a1b4e2cd6c2b94ca7759bbe5211d3d';
        // const redirect_uri = `${req.protocol}://${req.get('host')}/auth/42/callback`;
        const redirect_uri = `https%3A%2F%2Fwww.google.com`;
    
        const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=public`;
    
        return res.redirect(authorizeUrl);
    }

    async login(user: any) {
        
    }
}
