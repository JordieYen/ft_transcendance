import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/typeorm/channel.entity';
import { StatModule } from 'src/stat/stat.module';
import { UsersModule } from 'src/users/users.module';
import { ChannelUserModule } from '../channel-user/channel-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    StatModule,
    UsersModule,
    ChannelUserModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService, TypeOrmModule],
})
export class ChannelModule {}
