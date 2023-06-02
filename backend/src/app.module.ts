import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { AchievementModule } from './achievement/achievement.module';
import { UserAchievementModule } from './user_achievement/user_achievement.module';
import { configValidationSchema } from './config/config.schema';
import { FriendModule } from './friend/friend.module';
import { StatModule } from './stat/stat.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

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
    FriendModule,
    StatModule,
    // UserSettingsModule,
  ],
  controllers: [AppController ],
  providers: [ 
    AppService,
   ],
})

export class AppModule {}
