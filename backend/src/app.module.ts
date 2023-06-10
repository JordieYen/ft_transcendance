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
import { MyGateway } from './gateway/gateway';

const configFactory = {
  isGlocal: true,
  envFilePath: '../.env',
  validationSchema: configValidationSchema,
  cache: true,
}

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
    MessageModule
  ],
  controllers: [AppController ],
  providers: [ 
    AppService,
    FriendModule,
    StatModule,
    GatewayModule,
   ],
})

export class AppModule {}
