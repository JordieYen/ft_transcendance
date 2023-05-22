import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/typeorm/user.entity';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { SessionSerializer } from './util/session_serializer';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FortyTwoStrategy } from './util/42.strategy';
import { SessionEntity } from 'src/typeorm/session.entity';
import { Jwt2faStrategy } from './util/jwt.strategy';

const jwtFactory = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXP_H'),
    },
  }),
  inject: [ConfigService],
};

const passportFactory = {
  defaultStrategy: ['session', 'jwt-2fa'],
  session: false,
};

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register(passportFactory),
    JwtModule.registerAsync(jwtFactory),
    HttpModule,
  ],
  providers: [
    ConfigService,
    JwtService,
    UsersService,
    AuthService,
    Jwt2faStrategy,
    FortyTwoStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
