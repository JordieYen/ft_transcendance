import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
       private readonly authService: AuthService,
    ) {
        console.log('enter local strategy');
        super();
    }

    // async validate(res: Response) {
    //     console.log('validate user from local strategy');
    //     console.log(res);
    //     try {
    //         const user = await this.authService.redirectTo42OAuth(res);
    //         return user;
    //     } catch (error) {
    //         throw new UnauthorizedException();
    //     }
    // }
    async validate(username: string): Promise<any> {
        const user = await this.authService.validateUser(username);
        if (!user)
            throw new UnauthorizedException();
        return (user);
    }
}

