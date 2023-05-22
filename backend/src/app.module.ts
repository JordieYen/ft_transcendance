import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './typeorm/session.entity';
import { DataSource } from 'typeorm/data-source/DataSource';
import { Repository } from 'typeorm';
import { FriendModule } from './friend/friend.module';

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
  ],
  controllers: [AppController ],
  providers: [ 
    AppService,
   ],
})

export class AppModule {}
