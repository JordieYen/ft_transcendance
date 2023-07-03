import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from 'src/chat/message/message.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class MessageGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async onModuleInit() {}

  @SubscribeMessage('message')
  handleEvent(@MessageBody() message: string): string {
    console.log('message recieved');

    return message;
  }
}
