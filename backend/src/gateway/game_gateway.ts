import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'engine.io';
import { Engine, Vector } from 'matter-js';
import { Server } from 'socket.io';
import { GameService } from 'src/game/game.service';

interface Ball {
  speed: Vector;
  maxTimeFrame: number;
  perfectHitZone: number;
  perfectHitDuration: number;
}

interface Paddle {
  width: number;
  height: number;
  position: Vector;
}

interface GameElements {
  screen: Vector;
  border: Vector;
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  engine: Engine;

  constructor(private readonly gameService: GameService) {}

  async onModuleInit() {
    console.log('onModuleINit');
    // this.server.on('connection', (socket) => {
    // console.log(socket.id, ' game connected');

    this.engine = this.gameService.initializeEngine();

    // socket.on('initialize-game', async (gameProperties) => {
    //   this.gameService.initializeBorders(this.engine, gameProperties);
    //   this.gameService.initializePaddle(this.engine, gameProperties.leftPaddle);
    //   this.gameService.initializePaddle(
    //     this.engine,
    //     gameProperties.rightPaddle,
    //   );
    //   this.gameService.initializeBall(this.engine, gameProperties);
    // });

    // socket.on('disconnect', async () => {
    //   console.log('User disconnected: ' + socket.id);
    // });
    // });
  }

  handleConnection() {
    console.log('connected to game socket gateway');

    //Potentially not when connect but when he joins game instead

    // socket.on('game-room', async (data) => {
    //   socket.join(data.roomId);
    // });
  }

  @SubscribeMessage('initialize-game')
  async initializeGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() gameProperties: GameElements,
  ) {
    this.gameService.initializeBorders(this.engine, gameProperties);
    this.gameService.initializePaddle(this.engine, gameProperties.leftPaddle);
    this.gameService.initializePaddle(this.engine, gameProperties.rightPaddle);
    this.gameService.initializeBall(this.engine, gameProperties);

    console.log(this.engine);
    socket.emit('emit-engine');
  }

  handleDisconnect() {
    console.log('disconnected from game socket gateway');
  }
}
