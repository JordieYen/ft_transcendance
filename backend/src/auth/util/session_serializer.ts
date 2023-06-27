import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/typeorm/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    console.log('serialize user');
    done(null, user);
  }

  async deserializeUser(user: User, done: (err, user: User) => void) {
    console.log('deserializer user');
    done(null, user);
  }

  // serializeUser(user: Profile, done: (err: Error, user: Profile) => void): any {
  //     done(null, user);
  //   }

  // deserializeUser(payload: Profile, done: (err: Error, user: Profile) => void) {
  //     return done(null, payload);
  // }
}
