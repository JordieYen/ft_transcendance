import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './util/session_serializer';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FortyTwoStrategy } from './util/42.strategy';
import { Jwt2faStrategy } from './util/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { UserAchievementModule } from 'src/user_achievement/user_achievement.module';

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
  // defaultStrategy: ['jwt-2fa'],
  session: true,
};

@Module({
  imports: [
    ConfigModule,
    // TypeOrmModule.forFeature([User]),
    PassportModule.register(passportFactory),
    JwtModule.registerAsync(jwtFactory),
    HttpModule,
    UsersModule,
    UserAchievementModule,
  ],
  providers: [
    ConfigService,
    JwtService,
    AuthService,
    Jwt2faStrategy,
    FortyTwoStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
