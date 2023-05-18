import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config'
import { setupSwagger } from 'src/swagger.config';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { ISession, TypeormStore } from 'connect-typeorm/out';
import { DataSource } from 'typeorm';
import { SessionEntity } from './typeorm/session.entity';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  const sessionRepo = app.get(DataSource).getRepository<ISession>(SessionEntity);
  // function generateUniqueSessionID(): string {
  //   return uuidv4();
  // }
  // const generatedSessionID = generateUniqueSessionID();

  // const existingSession = await sessionRepo.findOne({ where: { id: generatedSessionID } });
  // if (existingSession) {
  //   await sessionRepo.remove(existingSession);
  // }
  // const newSession = sessionRepo.create({ id: generatedSessionID, /* ... other session data ... */ });
  // await sessionRepo.save(newSession);

  const secret = configService.get<string>('CLIENT_SECRET');
  const sessionMiddleware = session({
    name: 'ft_transcendence_session_id',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 600000,
    },
    store: new TypeormStore().connect(sessionRepo),
  });
  
  // Set up passport.initialize() and passport.session() with the session middleware
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    // req.user = req.session.user;
    req.session.user = req.user;
    // var status = req.isAuthenticated() ? 'logged in' : 'logged out';
    // console.log(
    //   'status:', status, '\n',
    //   req.sessionStore,
    //   req.sessionID,
    //   req.session
    // );
    // if (!req.user)
    //   return res.redirect('http://localhost:3001/login')
    next();
  });
  
  await app.listen(3000);
}
bootstrap();
