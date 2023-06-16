import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser } from 'src/typeorm/channel_user.entity';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/typeorm/user.entity';
import { ChannelUserService } from '../channel-user/channel-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelUser, User])],
  controllers: [ChannelController],
  providers: [ChannelService, UsersService, ChannelUserService]
})
export class ChannelModule {}
