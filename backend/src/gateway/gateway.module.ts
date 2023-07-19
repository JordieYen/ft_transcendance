import { Module } from '@nestjs/common';
import { FriendModule } from 'src/friend/friend.module';
import { UsersModule } from 'src/users/users.module';
import { FriendGateway } from './friend_gateway';
import { MessageGateway } from './messageGateway';
import { MessageModule } from 'src/chat/message/message.module';
import { GameGateway } from './game_gateway';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [FriendModule, UsersModule, MessageModule],
  providers: [FriendGateway, MessageGateway, GameGateway, GameService],
})
export class GatewayModule {}
