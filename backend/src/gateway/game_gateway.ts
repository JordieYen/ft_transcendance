import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from 'src/game/game.service';
import { Socket, Server } from 'socket.io';
import { Body, Engine } from 'matter-js';
import {
  GameElements,
  MovePaddleParams,
  StartGameParams,
  UserData,
} from 'src/game/game.interface';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  engine: Engine;
  leftPaddle: Body;
  rightPaddle: Body;
  ball: Body;
  rooms: Map<string, UserData[]> = new Map<string, UserData[]>();

  constructor(private readonly gameService: GameService) {}

  async onModuleInit() {
    console.log('onModuleInit');
    this.engine = this.gameService.initializeEngine();
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
      user: data.user,
    });
  }

  @SubscribeMessage('initialize-game')
  async initializeGame(client: Socket, gameProperties: GameElements) {
    this.gameService.initializeBorders(this.engine, gameProperties);
    this.leftPaddle = this.gameService.initializePaddle(
      this.engine,
      gameProperties.leftPaddle,
    );
    this.rightPaddle = this.gameService.initializePaddle(
      this.engine,
      gameProperties.rightPaddle,
    );
    this.ball = this.gameService.initializeBall(this.engine, gameProperties);
  }

  @SubscribeMessage('mouse-position')
  async movePaddle(client: Socket, data: MovePaddleParams) {
    this.gameService.updatePaddlePos({
      server: this.server,
      room: data.room,
      player: data.player,
      mouseY: data.mouseY,
      leftPaddle: this.leftPaddle,
      rightPaddle: this.rightPaddle,
      gameProperties: data.gameProperties,
    });
  }

  @SubscribeMessage('start-game')
  async startGame(client: Socket, data: StartGameParams) {
    this.gameService.handleGameState({
      server: this.server,
      room: data.room,
      ball: this.ball,
      gameProperties: data.gameProperties,
    });
  }

  handleDisconnect() {
    console.log('disconnected from game socket gateway');
  }
}
