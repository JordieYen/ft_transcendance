import { Module } from '@nestjs/common';
import { FriendModule } from 'src/friend/friend.module';
import { UsersModule } from 'src/users/users.module';
import { FriendGateway } from './friend_gateway';
import { MessageGateway } from './messageGateway';
import { MessageModule } from 'src/chat/message/message.module';
import { GameGateway } from './game_gateway';
import { ChannelModule } from 'src/chat/channel/channel.module';
import { ChannelGateway } from './channelGateway';
import { NotificationGateway } from './notification_gateway';

@Module({
  imports: [FriendModule, UsersModule, MessageModule, ChannelModule],
  providers: [
    FriendGateway,
    MessageGateway,
    GameGateway,
    ChannelGateway,
    NotificationGateway,
  ],
})
export class GatewayModule {}
