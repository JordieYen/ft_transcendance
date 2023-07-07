import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { formToJSON } from 'axios';
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
    let { roomId, roomPlayers } = this.findAvailableRoom();

    // create new room id and push player into room
    for (const [, existingRoomPlayers] of this.rooms) {
      if (existingRoomPlayers.includes(userName)) {
        client.emit('in-room', roomId);
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

  @SubscribeMessage('game-over')
  clearRoom(client: Socket, data: { roomId: number }) {
    console.log('Game over');
    const roomId = data.roomId.toString();
    const roomPlayers = this.rooms.get(roomId);
    if (roomPlayers) {
      roomPlayers.forEach((player) => {
        const client = this.server.sockets.sockets.get(player);
        if (client) {
          client.leave(roomId);
          client.disconnect();
        }
      });
    }
    this.rooms.delete(roomId.toString());
  }
}
