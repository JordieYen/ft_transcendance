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

interface AuthenticatedUser extends Express.User {
  readonly id?: number;
  intra_uid?: number;
  username?: string;
  avatar?: string;
  online?: boolean;
  accessToken?: string;
  refreshToken?: string;
  // Include other properties from your User entity
}

export { AuthenticatedUser };
