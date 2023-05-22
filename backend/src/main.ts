import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config'
import { setupSwagger } from 'src/swagger.config';
import * as passport from 'passport';
import { SessionSerializer } from './auth/util/session_serializer';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }) );
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: `${process.env.NEXT_HOST}`,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true, // Set this to true if you need to include cookies in the request
  });
  setupSwagger(app);
  app.use(session({
    name: 'shawn_session_id',
    secret: configService.get<string>('CLIENT_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000,
    },
  }));
  // const sessionSerializer = app.get(SessionSerializer);
  // sessionSerializer.deserializeUser(null, (err, user) => {
  //   if (err) {
  //     console.error('Error deserializing user:', err);
  //   } else {
  //     console.log('Deserialized user:', user);
  //   }
  // });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    req.user = req.session.user;
    next();
  });

  await app.listen(3000);
}
bootstrap();
