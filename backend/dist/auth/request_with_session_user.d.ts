import { Request } from 'express';
import { Session } from 'express-session';
import { User } from 'src/typeorm/user.entity';
interface RequestWithSessionUser extends Request {
    session: Session & {
        user?: User;
        accessToken?: string;
        refreshToken: string;
    };
}
export { RequestWithSessionUser };
