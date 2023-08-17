import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/typeorm/message.entity';
import { StatModule } from 'src/stat/stat.module';
import { ChannelModule } from '../channel/channel.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    StatModule,
    ChannelModule,
    UsersModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService, TypeOrmModule],
})
export class MessageModule {}
