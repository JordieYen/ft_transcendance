import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config'
import { setupSwagger } from 'src/swagger.config';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { ISession, TypeormStore } from 'connect-typeorm/out';
import { Connection, DataSource, getConnection, getRepository, Repository } from 'typeorm';
import { SessionEntity } from './typeorm/session.entity';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { Jwt2faStrategy } from './auth/util/jwt.strategy';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: `${process.env.NEXT_HOST}`,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true, // Set this to true if you need to include cookies in the request
  });
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe(({
    whitelist: true,
  })));
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });

  // const databaseModule = app.select(DatabaseModule);
  // const connection = getConnection();
  // const sessionRepo = connection.getRepository<ISession>(SessionEntity); // Replace SessionEntity with your actual session entity class
  // const sessionRepo = app.get(DataSource).getRepository<ISession>(SessionEntity);
  const sessionMiddleware = session({
    name: 'ft_transcendence_session_id',
    secret: configService.get<string>('CLIENT_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 600000,
    },
    // store: new TypeormStore().connect(
    //   app.get('sessionRepository'), // Use the session repository instance
    // ),
    // store: new TypeormStore().connect(sessionRepo),
  });
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
      req.session.user = req.user;
    // var status = req.isAuthenticated() ? 'logged in' : 'logged out';
    // console.log(
    //   'status:', status, '\n',
    //   // 'session', req.session, '\n',
    //   'path', req.path, '\n',
    //   );
    // const isAuthRoute = (req.path == '/auth/login' 
    // || req.path == '/auth/callback' 
    // || req.path == '/auth/logout'
    // || req.path == '/api');
    // if (isAuthRoute)
    //   next;
    // if (!req.isAuthenticated() && !isAuthRoute) {
    //     console.log('enter');
    //     return res.redirect(`${process.env.NEXT_HOST}/login`)
    // }
      next();
  });

  
  await app.listen(3000);
}
bootstrap();
