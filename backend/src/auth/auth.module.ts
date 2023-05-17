import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/typeorm/user.entity';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './util/session_serializer';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './util/jwt-auth.guard';
import { FortyTwoStrategy } from './util/42.strategy';
// import { JwtStrategy } from './util/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    PassportModule.register({
      defaultStrategy: 'session',
      session: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d'},
      }),
      inject: [ConfigService],
    })
  ],
  providers: [
    ConfigService,
    JwtService,
    AuthService,
    UsersService,
    SessionSerializer,
    JwtAuthGuard,
    // JwtStrategy,
    FortyTwoStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    console.log(`JWTSECRET: ${jwtSecret}`);
    
  }
}
