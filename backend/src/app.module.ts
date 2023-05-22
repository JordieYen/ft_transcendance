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

@Module({
  imports: [
    ConfigModule.forRoot({ 
        isGlobal: true,
        envFilePath: '../.env'
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MatchHistoryModule,
    AchievementModule,
    UserAchievementModule,
    ChannelModule,
    ChannelUserModule
  ],
  controllers: [AppController],
  providers: [ AppService ],
})
export class AppModule {
  constructor() {}
}
