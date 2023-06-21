import { Module } from '@nestjs/common';
import { ChannelUserController } from './channel-user.controller';
import { ChannelUserService } from './channel-user.service';
import { User } from 'src/typeorm/user.entity';
import { ChannelUser } from 'src/typeorm/channel_user.entity';
import { Channel } from 'src/typeorm/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { ChannelService } from '../channel/channel.service';
import { StatModule } from 'src/stat/stat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelUser, User]),
    StatModule
  ],
  controllers: [ChannelUserController],
  providers: [ChannelUserService, UsersService]
})
export class ChannelUserModule {}
