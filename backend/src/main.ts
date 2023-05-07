import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { generate } from 'randomstring';
import { ConfigService } from '@nestjs/config'
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(session({
    secret: configService.get<string>('CLIENT_SECRET'),
    resave: false,
    saveUninitialized: false,
    genid: () => {
      const sessionId = generate({ length: 10, charset: 'alphanumeric' });
      return (sessionId);
    }
  }));

  app.use(express.static(join(__dirname, '..', '..', 'frontend')));
  await app.listen(3000);
}
bootstrap();
