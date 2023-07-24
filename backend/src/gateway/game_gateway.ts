import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from 'src/game/game.service';
import { Socket, Server } from 'socket.io';
import {
  GameInfo,
  MovePaddleParams,
  StartGameParams,
  UserData,
  InitializeGameParam,
} from 'src/game/game.interface';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  rooms: Map<string, UserData[]> = new Map<string, UserData[]>();
  gameInfo: Map<string, GameInfo> = new Map<string, GameInfo>();

  constructor(private readonly gameService: GameService) {}

  async onModuleInit() {
    // does something on Game Module init
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, data: { user: UserData }) {
    data.user.socketId = client.id;
    this.gameService.joinRooms({
      server: this.server,
      client: client,
      rooms: this.rooms,
      user: data.user,
    });
  }

  @SubscribeMessage('game-over')
  clearRoom(client: Socket, data: { roomId: string; user: UserData }) {
    this.gameService.leaveRoom({
      server: this.server,
      roomId: data.roomId,
      rooms: this.rooms,
      gameInfo: this.gameInfo,
      user: data.user,
    });
  }

  @SubscribeMessage('initialize-game')
  async initializeGame(client: Socket, data: InitializeGameParam) {
    this.gameInfo.set(data.roomId, this.gameService.initializeGame(data));
  }

  @SubscribeMessage('mouse-position')
  async movePaddle(client: Socket, data: MovePaddleParams) {
    this.gameService.updatePaddlePos({
      server: this.server,
      roomId: data.roomId,
      player: data.player,
      mouseY: data.mouseY,
      gameInfo: this.gameInfo.get(data.roomId),
      gameProperties: data.gameProperties,
    });
  }

  number = 0;
  @SubscribeMessage('start-game')
  async startGame(client: Socket, data: StartGameParams) {
    this.gameService.handleGameState({
      server: this.server,
      roomId: data.roomId,
      gameInfo: this.gameInfo.get(data.roomId),
      gameProperties: data.gameProperties,
    });
  }

  handleDisconnect() {
    console.log('disconnected from game socket gateway');
  }
}
