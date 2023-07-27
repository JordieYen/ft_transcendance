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
import { FriendService } from 'src/friend/services/friend.service';
import { User } from 'src/typeorm/user.entity';

@WebSocketGateway({
  cors: {
    // origin: 'http://localhost:3001',
    // origin: `${process.env.NEXT_HOST}`,
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  rooms: Map<string, User[]> = new Map<string, User[]>();

  constructor(private readonly friendService: FriendService) {}

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

  @SubscribeMessage('join-room')
  async handleJoinRoom(client: Socket, data: { user: User }) {
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

    // update user room id in friend
    console.log('User: ', user.id);

    const friends = await this.friendService.getFriendsBoth(user.id);
    for (const friend of friends) {
      console.log('Friend: ', friend);
      const result = await this.friendService.update(friend.id, {
        ...friend,
        roomId: roomId,
      });
      console.log('result: ', result);
    }

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
  async clearRoom(client: Socket, data: { roomId: string; user: User }) {
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
        this.clearRoomIdInFriend(user.id);
      }
    }
  }

  async clearRoomIdInFriend(id: number) {
    const friends = await this.friendService.getFriendsBoth(id);
    for (const friend of friends) {
      console.log('Friend: ', friend);
      const result = await this.friendService.update(friend.id, {
        ...friend,
        roomId: null,
      });
      console.log('result: ', result);
    }
  }

  @SubscribeMessage('invite-game')
  async handleInviteGame(client: Socket, data: { user: User; friend: User }) {
    const user = data.user;
    const friend = data.friend;
    client.to(friend.id.toString()).emit('invite-game', { user, friend });
  }
}
