import { Module } from '@nestjs/common';
import { ChannelUserController } from './channel-user.controller';
import { ChannelUserService } from './channel-user.service';
import { ChannelUser } from 'src/typeorm/channel_user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatModule } from 'src/stat/stat.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelUser]), StatModule, UsersModule],
  controllers: [ChannelUserController],
  providers: [ChannelUserService],
  exports: [ChannelUserService, TypeOrmModule],
})
export class ChannelUserModule {}
