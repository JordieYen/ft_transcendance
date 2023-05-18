import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { RequestWithSessionUser } from "./request_with_session_user";
import { AuthService } from "../services/auth.service";
import { EntityRepository, Repository } from "typeorm";
import { SessionEntity } from "src/typeorm/session.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        @InjectRepository(SessionEntity) private sessionRepository: Repository<SessionEntity>
        ) 
        {
    }

    async canActivate(context: ExecutionContext) : Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        console.log('authenticate req user', req.user);
        console.log('authenticate req user', req.session.user);
        // if (req?.user) {
        //     return true;
        // }
        const sessionID: string = req.sessionID;
        const session = await this.sessionRepository.findOne({ where: {id: sessionID }});
        // console.log('sessionID', sessionID);
        console.log('session', session);
        
        if (session) {
            console.log('retrieve session');
            const sessionData = JSON.parse(session.json);
            const user = sessionData.user;
            console.log('user', user);
            
            req.user = user;
            req.session.user = user;
            console.log('session', req.user);
            
            req.isAuthenticated = true;
            return(true);
        }
   
        return false;
    }
}
