import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomBytes } from 'crypto';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  rooms: Map<string, string[]> = new Map<string, string[]>();

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
      console.log(`Room ${roomId}: `, `[${players.join(', ')}]`);
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

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, data: { userName: string }) {
    const userName = data.userName;
    console.log('socket', client.data);

    let { roomId, roomPlayers } = this.findAvailableRoom();

    // create new room id and push player into room
    for (const [, existingRoomPlayers] of this.rooms) {
      if (existingRoomPlayers.includes(userName)) {
        client.emit('error', 'You are already in a room');
        console.log('User is already in a room');
        return;
      }
    }

    if (!roomId && !roomPlayers) {
      roomId = this.generateRoomId();
      roomPlayers = [userName];
      this.rooms.set(roomId, roomPlayers);
    } else {
      // push player into existing room
      roomPlayers.push(userName);
    }
    client.join(roomId);
    client.emit('joined-room', roomId);
    if (roomPlayers.length === 2) {
      this.server.to(roomId).emit('start-game', roomId);
    }
    this.logRooms();
  }
}
