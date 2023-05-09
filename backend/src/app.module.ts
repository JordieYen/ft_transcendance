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

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '../.env'
  }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'src'),
      // rootPath: join(process.cwd(), '..', 'frontend'),
      serveRoot: '/frontend',
      // exclude: ['/api*'],
    }),
    MatchHistoryModule
  ],
  controllers: [AppController ],
  providers: [ AppService ],
})
export class AppModule {
  constructor() {
    console.log('dirname:', __dirname);
    console.log('join dirname:', join(__dirname, '..', '..', '..', 'frontend', 'src'));
    console.log('cwd', join(process.cwd(), '..', 'frontend'));
  }
}
