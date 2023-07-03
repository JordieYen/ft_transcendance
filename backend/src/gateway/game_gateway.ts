import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'dgram';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, ' game connected');

      socket.on('game-room', async (data) => {
        console.log('game-room');
        console.log('data', data);
        socket.join(data.roomId);
      });
      socket.on('disconnect', async () => {
        console.log('User disconnected: ' + socket.id);
      });
    });
  }
}
