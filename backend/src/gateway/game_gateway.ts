import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from 'src/game/game.service';
import { User } from 'src/typeorm/user.entity';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Body, Engine, Vector } from 'matter-js';

interface Ball {
  position: Vector;
  radius: number;
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
  leftPaddle: Body;
  rightPaddle: Body;
  ball: Body;
  rooms: Map<string, User[]> = new Map<string, User[]>();

  constructor(private readonly gameService: GameService) {}

  async onModuleInit() {
    console.log('onModuleInit');
    this.engine = this.gameService.initializeEngine();
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, data: { user: User }) {
    const user = data.user;
    const userName = user.username;
    let { roomId, roomPlayers } = this.gameService.findAvailableRoom(
      this.rooms,
    );

    // check if user is already in a room
    for (const [existingRoomId, existingRoomPlayers] of this.rooms) {
      if (existingRoomPlayers.includes(user)) {
        console.log('User is already in a room', userName, existingRoomId);
        roomId = existingRoomId;
        client.emit('in-room', roomId);
        console.log('User is already in a room');
        return;
      }
    }
    // create new room id and push player into room
    if (!roomId && !roomPlayers) {
      roomId = this.gameService.generateRoomId(this.rooms);
      roomPlayers = [user];
      this.rooms.set(roomId, roomPlayers);
    } else {
      // push player into existing room
      roomPlayers.push(user);
    }
    client.join(roomId);
    client.emit('joined-room', roomId);

    // start game if room has 2 players

    if (roomPlayers.length === 2) {
      const playersData = roomPlayers.map((player) => ({
        player: player,
      }));
      this.server
        .to(roomId)
        .emit('loading-screen', { roomId, players: playersData });
    }
    this.gameService.logRooms(this.rooms);
  }

  @SubscribeMessage('game-over')
  clearRoom(client: Socket, data: { roomId: string; user: User }) {
    const roomId = data.roomId;
    console.log('Game over', roomId);
    const user = data.user;
    const roomPlayers = this.rooms.get(roomId);

    // check if player exists in room, if one player exist, send opponent-disconnected
    if (roomPlayers) {
      console.log('Room players: ', roomPlayers);
      const remainingPlayer = roomPlayers.find((player) => player !== user);
      console.log('Remaining player: ', remainingPlayer);

      if (remainingPlayer) {
        this.server.to(roomId).emit('opponent-disconnected');
      }
      const updatedRoomPlayers = roomPlayers.filter(
        (player) => player !== user,
      );
      this.rooms.set(roomId, updatedRoomPlayers);

      // if room is empty, delete room and emit room-closed
      if (updatedRoomPlayers.length === 0) {
        this.rooms.delete(roomId);
        this.server.to(roomId).emit('room-closed');
      }
    }
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

  // @SubscribeMessage('mousePosition')
  // async movePaddle(
  //   client: Socket,
  //   data: {
  //     room: string;
  //     mousePosition: number;
  //     gameProperties: GameElements;
  //   },
  // ) {
  //   Body.setPosition(this.leftPaddle, {
  //     x: data.gameProperties.leftPaddle.position.x,
  //     y: data.mousePosition,
  //   });
  //   Body.setPosition(this.rightPaddle, {
  //     x: data.gameProperties.rightPaddle.position.x,
  //     y: data.mousePosition,
  //   });
  //   this.server
  //     .to(data.room)
  //     .emit('leftPaddlePosition', this.leftPaddle.position);
  //   this.server
  //     .to(data.room)
  //     .emit('rightPaddlePosition', this.rightPaddle.position);
  // }

  gameStarted = 0;
  @SubscribeMessage('start-game')
  async startGame(
    client: Socket,
    data: { room: string; gameProperties: GameElements },
  ) {
    if (this.gameStarted === 0) {
      Body.setVelocity(this.ball, {
        x: data.gameProperties.ball.speed.x,
        y: data.gameProperties.ball.speed.y,
      });
      this.server
        .to(data.room)
        .emit('ballSpeed', data.gameProperties.ball.speed);
      this.gameStarted = 1;
      setInterval(() => {
        if (this.gameStarted) {
          this.server.to(data.room).emit('ballPosition', this.ball.position);
          if (
            this.ball.position.x < -50 ||
            this.ball.position.x > data.gameProperties.screen.x + 50
          ) {
            Body.setPosition(this.ball, {
              x: data.gameProperties.screen.x / 2,
              y: data.gameProperties.screen.y / 2,
            });
            Body.setVelocity(this.ball, {
              x: 0,
              y: 0,
            });
            this.server.to(data.room).emit('ballPosition', {
              x: data.gameProperties.screen.x / 2,
              y: data.gameProperties.screen.y / 2,
            });
            this.server.to(data.room).emit('ballSpeed', { x: 0, y: 0 });
            this.gameStarted = 0;
          }
        }
      }, 15);
    }
  }

  handleDisconnect() {
    console.log('disconnected from game socket gateway');
  }
}
