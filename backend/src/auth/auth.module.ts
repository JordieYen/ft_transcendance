import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/typeorm/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './util/local_strategy';
import { SessionSerializer } from './util/session_serializer';
import { BearerStrategy } from './util/bearer_strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './util/jwt.strategy';
import { UserGuard } from './util/local.guard';
import { JwtAuthGuard } from './util/jwt-auth.guard';
import { Request, Response } from 'express';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    PassportModule.register({
      defaultStrategy: 'bearer',
      session: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h'},
      }),
      inject: [ConfigService],
    })
  ],
  providers: [
    AuthService,
    UsersService,
    ConfigService,
    LocalStrategy,
    SessionSerializer,
    BearerStrategy,
    JwtStrategy,
    JwtAuthGuard,
    UserGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
