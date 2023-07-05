import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  async onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, ' game connected');

      socket.on('game-room', async (data) => {
        console.log('game-room');
        console.log('data', data);
        this.gameService.logic();
        socket.join(data.roomId);
      });
      socket.on('disconnect', async () => {
        console.log('User disconnected: ' + socket.id);
      });
    });
  }
}
