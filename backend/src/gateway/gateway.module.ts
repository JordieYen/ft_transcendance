import { Module } from '@nestjs/common';
import { FriendModule } from 'src/friend/friend.module';
import { UsersModule } from 'src/users/users.module';
import { FriendGateway } from './friend_gateway';
import { MessageGateway } from './messageGateway';
import { MessageModule } from 'src/chat/message/message.module';
import { GameGateway } from './game_gateway';
import { GameService } from 'src/game/game.service';
import { MatchHistoryModule } from 'src/match-history/match-history.module';
import { MatchHistoryService } from 'src/match-history/services/match-history.service';
import { StatModule } from 'src/stat/stat.module';
import { StatService } from 'src/stat/services/stat.service';
import { AchievementModule } from 'src/achievement/achievement.module';
import { AchievementService } from 'src/achievement/services/achievement.service';
import { UserAchievementModule } from 'src/user_achievement/user_achievement.module';
import { UserAchievementService } from 'src/user_achievement/services/user_achievement.service';
import { ChannelModule } from 'src/chat/channel/channel.module';
import { ChannelGateway } from './channelGateway';
import { NotificationGateway } from './notification_gateway';
import { ChannelUserModule } from 'src/chat/channel-user/channel-user.module';

@Module({
  imports: [
    StatModule,
    UsersModule,
    FriendModule,
    MessageModule,
    ChannelModule,
    AchievementModule,
    MatchHistoryModule,
    UserAchievementModule,
    ChannelUserModule,
  ],
  providers: [
    GameGateway,
    GameService,
    StatService,
    FriendGateway,
    MessageGateway,
    ChannelGateway,
    AchievementService,
    MatchHistoryService,
    NotificationGateway,
    UserAchievementService,
  ],
})
export class GatewayModule {}
