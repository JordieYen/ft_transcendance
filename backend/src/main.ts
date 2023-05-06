import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { generate } from 'randomstring';
import { ConfigService } from '@nestjs/config'

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
  await app.listen(3000);
}
bootstrap();
