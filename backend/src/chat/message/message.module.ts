import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/typeorm/message.entity';
import { UsersService } from 'src/users/services/users.service';
import { ChannelService } from '../channel/channel.service';
import { ChannelUserService } from '../channel-user/channel-user.service';
import { User } from 'src/typeorm/user.entity';
import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser } from 'src/typeorm/channel_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Channel, ChannelUser])],
  controllers: [MessageController],
  providers: [MessageService, UsersService, ChannelService, ChannelUserService],
  exports: [MessageService, TypeOrmModule],
})
export class MessageModule {}
