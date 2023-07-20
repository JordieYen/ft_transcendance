import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChannelService } from 'src/chat/channel/channel.service';
import { CreateChannelDto } from 'src/chat/channel/dto';
import { User } from 'src/users/decorators/user.decorator';
import { UsersService } from 'src/users/services/users.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class ChannelGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly channelService: ChannelService,
    private readonly userService: UsersService,
  ) {}

  async onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'channel socket connected');

      socket.on(
        'create-channel',
        async (channelName, channelType, channelPassword, userId) => {
          console.log(channelName, channelType, channelPassword, userId);
          const user = await this.userService.findUsersById(userId);
          const dto: CreateChannelDto = {
            channel_name: channelName,
            channel_type: channelType,
            channel_hash: channelPassword,
          };
          const new_channel = await this.channelService.createChannel(
            dto,
            user,
          );
          console.log(new_channel);
          this.server.emit('channel-created', new_channel);
        },
      );
    });
  }
}
