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

@Module({
  imports: [
    FriendModule,
    UsersModule,
    MessageModule,
    StatModule,
    AchievementModule,
    UserAchievementModule,
    MatchHistoryModule,
  ],
  providers: [
    FriendGateway,
    MessageGateway,
    GameGateway,
    GameService,
    StatService,
    AchievementService,
    UserAchievementService,
    MatchHistoryService,
  ],
})
export class GatewayModule {}
