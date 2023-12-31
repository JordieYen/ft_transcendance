import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { ChannelModule } from './chat/channel/channel.module';
import { AchievementModule } from './achievement/achievement.module';
import { UserAchievementModule } from './user_achievement/user_achievement.module';
import { ChannelUserModule } from './chat/channel-user/channel-user.module';
import { MessageModule } from './chat/message/message.module';
import { configValidationSchema } from './config/config.schema';
import { FriendModule } from './friend/friend.module';
import { StatModule } from './stat/stat.module';
import { GatewayModule } from './gateway/gateway.module';
import { GameInvitationModule } from './game-invitation/game-invitation.module';

const configFactory = {
  isGlocal: true,
  envFilePath: '../.env',
  validationSchema: configValidationSchema,
  cache: true,
};

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(configFactory),
    UsersModule,
    AuthModule,
    MatchHistoryModule,
    AchievementModule,
    UserAchievementModule,
    ChannelModule,
    ChannelUserModule,
    MessageModule,
    FriendModule,
    StatModule,
    GatewayModule,
    GameInvitationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
