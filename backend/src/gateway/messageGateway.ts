import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateMessageDto } from 'src/chat/message/dto';
import { MessageService } from 'src/chat/message/message.service';
import { User } from 'src/users/decorators/user.decorator';
import { UsersService } from 'src/users/services/users.service';

@WebSocketGateway({
  cors: {
    // origin: 'http://localhost:3001',
    // origin: `${process.env.NEXT_HOST}`,
  },
})
export class MessageGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UsersService,
  ) {}

  async onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'message connected');

      socket.on(
        'send-message',
        async (message, messageType, channelId, userId) => {
          console.log(message, messageType, channelId, userId);
          const user = await this.userService.findUsersById(userId);
          console.log(user);
          const dto: CreateMessageDto = {
            message_content: message,
            message_type: messageType,
            channel_id: channelId,
          };
          const sent_message = await this.messageService.createMessage(
            dto,
            user,
          );
          console.log(sent_message);
          this.server.emit('message-recieved', sent_message, channelId);
        },
      );
    });
  }
}
