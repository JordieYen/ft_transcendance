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
import { AuthMiddleware } from './auth/util/auth.middleware';
import { NestFactory } from '@nestjs/core';

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
  ],
  controllers: [AppController ],
  providers: [ AppService ],
})
export class AppModule {}
// export class AppModule implements NestModule {
  // constructor(private readonly appService: AppService) {}
  // async configure(consumer: MiddlewareConsumer) {
    // const app = await NestFactory.create(AppModule);
  
    // app.enableCors({
    //   origin: `${process.env.NEXT_HOST}`,
    //   methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    //   credentials: true, // Set this to true if you need to include cookies in the request
    // });
    // consumer
      // .apply(AuthMiddleware)
      // .exclude('/auth/login', '/auth/callback', '/auth/logout')
      // .forRoutes('*');
  // }
// }
