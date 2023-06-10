import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session, * as ExpressSession from 'express-session'; 
import { ConfigService } from '@nestjs/config'
import { setupSwagger } from 'src/swagger.config';
import * as passport from 'passport';
<<<<<<< HEAD
import { SessionSerializer } from './auth/util/session_serializer';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }) );
  const configService = app.get(ConfigService);
=======
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as pg from 'pg';
import * as connectPgSimple from 'connect-pg-simple';
import { ISession, TypeormStore } from 'connect-typeorm';
import { Store } from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
>>>>>>> master
  app.enableCors({
    origin: process.env.NEXT_HOST,
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

  //  connect-pg-simple.
  const pgPool = new pg.Pool({
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_USER,
    user: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  const pgSessionStore = connectPgSimple(ExpressSession);
  const sessionStore = new pgSessionStore({
    pool: pgPool,
    createTableIfMissing: true,
    // tableName: 'session_entity',
  })
  const sessionOption= ExpressSession({
    name: 'ft_transcendence_session_id',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1 * 24 * 60 * 60 * 100, // 1 day in milisesonds
    },
    store: sessionStore as Store,
  });
  app.use(sessionOption);
  app.use(cookieParser())
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
      // req.session.user = req.user;
    var status = req.isAuthenticated() ? 'logged in' : 'logged out';
    console.log('status:', status, '\n', 'path', req.path, '\n');
    console.log(
    //   // 'session', req.session, '\n',
    );
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
