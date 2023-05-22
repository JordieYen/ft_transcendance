import { Module } from '@nestjs/common';
import { FriendService } from './services/friend.service';
import { FriendController } from './controllers/friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/typeorm/friends.entity';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/typeorm/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, User]),
  ],
  controllers: [FriendController],
  providers: [FriendService, UsersService]
})
export class FriendModule {}
