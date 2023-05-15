import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config'
import { setupSwagger } from 'src/swagger.config';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: 'http://localhost:3001', // Replace with the URL of your React frontend
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    // allowedHeaders: 'Content-Type, Accept',
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

  app.use(passport.initialize());
  app.use(passport.session());
  // app.use((req: Request, res: Response, next) => {
  //   console.log('Received request:', req.method, req.url);
  //   console.log('Request headers:', req.headers);
  //   next();
  // });
  // Attach user object to req
  app.use((req, res, next) => {
    req.user = req.session.user;
    next();
  });
    
  // app.use(express.static(join(__dirname, '..', '..', 'frontend')));
  await app.listen(3000);
}
bootstrap();
