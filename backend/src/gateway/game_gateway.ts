import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomBytes } from 'crypto';
import { GameService } from 'src/game/game.service';
import { User } from 'src/typeorm/user.entity';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { Engine, Vector } from 'matter-js';

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
  rooms: Map<string, User[]> = new Map<string, User[]>();

  constructor(private readonly gameService: GameService) {}

  async onModuleInit() {
    console.log('onModuleINit');
    this.engine = this.gameService.initializeEngine();
  }

  generateRoomId() {
    const roomIdLength = 3;
    const roomId = randomBytes(roomIdLength)
      .toString('hex')
      .slice(0, roomIdLength);
    this.rooms.set(roomId, []);
    return roomId;
  }

  logRooms() {
    for (const [roomId, players] of this.rooms.entries()) {
      const usernames = players.map((player) => player.username).join(', ');
      console.log(`Room ${roomId}: [${usernames}]`);
    }
  }

  findAvailableRoom() {
    for (const [roomId, roomPlayers] of this.rooms) {
      if (roomPlayers.length < 2) {
        return { roomId, roomPlayers };
      }
    }
    return {};
  }

  handleConnection() {
    console.log('connected to game socket gateway');

    //Potentially not when connect but when he joins game instead

    // socket.on('game-room', async (data) => {
    //   socket.join(data.roomId);
    // });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, data: { user: User }) {
    const user = data.user;
    const userName = user.username;
    let { roomId, roomPlayers } = this.findAvailableRoom();

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
      roomId = this.generateRoomId();
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
    this.logRooms();
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
