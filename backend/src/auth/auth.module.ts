import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Users } from 'src/typeorm/users.entity';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [ TypeOrmModule.forFeature([Users]), HttpModule],
  providers: [AuthService, UsersService, ConfigService,
  {
    provide: 'AXIOS_INSTANCE_TOKEN',
    useValue: new HttpService(),
  }],
  controllers: [AuthController]
})
export class AuthModule {}
