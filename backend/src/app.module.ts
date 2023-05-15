import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { PassportModule } from '@nestjs/passport';
import { AchievementModule } from './achievement/achievement.module';
import { UserAchievementModule } from './user_achievement/user_achievement.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
        isGlobal: true,
        envFilePath: '../.env'
    }),
    PassportModule.register({ defaultStrategy: 'bearer' }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MatchHistoryModule,
    AchievementModule,
    UserAchievementModule,
  ],
  controllers: [AppController ],
  providers: [ AppService ],
})
export class AppModule {
  constructor() {}
}
