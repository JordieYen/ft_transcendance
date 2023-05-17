import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser } from 'src/typeorm/channel_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelUser]), ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
