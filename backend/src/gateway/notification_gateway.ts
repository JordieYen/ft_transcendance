import { BadRequestException, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { User } from 'src/typeorm/user.entity';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { UsersService } from 'src/users/services/users.service';

@WebSocketGateway()
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private connectedUser: Map<string, Socket> = new Map<string, Socket>();

  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'connected');

      const heartbeat = setInterval(() => {
        if (!socket.connected) {
          clearInterval(heartbeat);
          console.log('heartbeat stopped');
          if (socket.data.userId) {
            this.updateUserStatus(+socket.data.userId, false);
            this.connectedUser.delete(socket.data.userId);
          }
        }
      }, 300000);

      socket.on('join', async (userId) => {
        if (userId && userId !== 'undefined' && !isNaN(userId)) {
          console.log('User joined room: ' + userId);
          socket.join(userId.toString());
          socket.data.userId = userId;
          this.updateUserStatus(+userId, true);

          const existingSocket = this.connectedUser.get(userId);
          if (!existingSocket || existingSocket.id !== socket.id) {
            this.connectedUser.set(userId, socket);
            console.log('after: ', this.connectedUser.size);
            this.server
              .to(socket.data.userId.toString())
              .emit('online-status-changed', { isOnline: true });
          }
          this.logConnectedUsers();
        }
      });

      socket.on('leave-room', () => {
        if (socket.data.userId) {
          console.log('User left room: ' + socket.data.userId);
          socket.leave(socket.data.userId);
          this.updateUserStatus(socket.data.userId, false);
          this.connectedUser.delete(socket.data.userId);
          this.server
            .to(socket.data.userId.toString())
            .emit('online-status-changed', { isOnline: false });
          this.logConnectedUsers();
        }
      });

      socket.on('activity', () => {
        if (socket.data.userId) {
          // console.log('User activity: ' + socket.data.userId);
          this.updateUserStatus(socket.data.userId, true);
          this.connectedUser.set(socket.data.userId, socket);
          // this.server
          //   .to(socket.data.userId)
          //   .emit('online-status-changed', { isOnline: true });
        }
      });

      socket.on('reconnect', async () => {
        if (socket.data.userId) {
          console.log('User reconnected: ' + socket.data.userId);
          this.updateUserStatus(+socket.data.userId, true);
          this.connectedUser.set(socket.data.userId, socket);
          this.server
            .to(socket.data.userId.toString())
            .emit('online-status-changed', { isOnline: true });
          this.logConnectedUsers();
        }
      });
      socket.on('disconnect', async () => {
        if (socket.data.userId) {
          console.log('User disconnected: ' + socket.data.userId);
          this.connectedUser.delete(socket.data.userId);
          await this.updateUserStatus(+socket.data.userId, false);
          this.server
            .to(socket.data.userId.toString())
            .emit('online-status-changed', { isOnline: false });
          this.logConnectedUsers();
        }
      });
    });
  }

  private async updateUserStatus(userId: any, isOnline: boolean) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      console.log('Invalid userId');
      throw new BadRequestException('Invalid userId');
    }
    const user = await this.usersService.findUsersById(parsedUserId);
    if (user) {
      await this.usersService.updateUser(parsedUserId, {
        online: isOnline,
      });
    }
  }
  private logConnectedUsers() {
    console.log('Connected users: ');
    console.log('number: ', this.connectedUser.size);
    for (const [userId, socket] of this.connectedUser.entries()) {
      console.log('User ID:', userId, ', Socket ID:', socket.id);
    }
  }
}
