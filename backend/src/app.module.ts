import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MatchHistoryModule } from './match-history/match-history.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '../.env'
  }),
    MatchHistoryModule,
    ChatModule
  ],
  controllers: [AppController ],
  providers: [ AppService ],
})
export class AppModule {
  constructor() {}
}
