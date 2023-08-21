import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { FriendService } from 'src/friend/services/friend.service';
import { UsersService } from 'src/users/services/users.service';

@WebSocketGateway({
  cors: {
    // origin: 'http://localhost:3001',
    // origin: `${process.env.NEXT_HOST}`,
  },
})
export class FriendGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly friendService: FriendService,
    private readonly usersService: UsersService,
  ) {}

  private async updateUserStatus(userId: any, isOnline: boolean) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      console.log('Invalid userId');
      // throw new BadRequestException('Invalid userId');
    }
    const user = await this.usersService.findUsersById(parsedUserId);
    if (user) {
      // console.log(user);
      await this.usersService.updateUser(parsedUserId, {
        online: isOnline,
      });
    }
  }

  @SubscribeMessage('friend-request-sent')
  async handleFriendRequestSent(
    client: Socket,
    data: { senderId: number; receiverId: number },
  ) {
    try {
      const { senderId, receiverId } = data;
      await this.sendFriendRequest(senderId, receiverId);
      await this.getReceiveFriendRequest(receiverId);
      // await this.getSentFriendRequest(senderId);
    } catch (error) {
      console.error('Error sending friend request gateway', error);
    }
  }

  @SubscribeMessage('friend-request-cancel')
  async handleCancelFriendRequest(
    client: Socket,
    data: { senderId: number; receiverId: number; friendRequestId: number },
  ) {
    try {
      const { senderId, receiverId, friendRequestId } = data;
      const cancelRequest = await this.friendService.unFriend(friendRequestId);
      this.server.emit('friend-request-received', cancelRequest);
      // this.server.to(`${receiverId}`).emit('friend-request', null);
      await this.getReceiveFriendRequest(receiverId);
    } catch (error) {
      console.error('Error canceling friend request gateway', error);
    }
  }

  @SubscribeMessage('friend-request-received')
  async sendFriendRequest(senderId: number, receiverId: number) {
    const friendRequest = await this.friendService.sendFriendRequest(
      senderId,
      receiverId,
    );
    this.server.emit('friend-request-received', friendRequest);
  }

  async getSentFriendRequest(senderId: number) {
    const friendRequests = await this.friendService.getSentFriendRequest(
      senderId,
    );
    // this.server.emit('friend-request-received', friendRequests);
    this.server.to(`${senderId}`).emit('friend-request', friendRequests);
  }

  @SubscribeMessage('friend-request')
  async getReceiveFriendRequest(receiverId: number) {
    const friendRequests = await this.friendService.getReceivedFriendRequest(
      receiverId,
    );
    // this.server.emit('friend-request', friendRequests);
    this.server.to(`${receiverId}`).emit('friend-request', friendRequests);
  }

  @SubscribeMessage('accept-friend-request')
  async acceptFriendRequest(
    client: Socket,
    data: { userId: number; senderId: number; friendRequestId: number },
  ) {
    try {
      const { userId, senderId, friendRequestId } = data;
      const acceptRequest = await this.friendService.acceptFriendRequest(
        friendRequestId,
      );
      const friendsForAccepter = await this.friendService.getFriends(userId);
      const friendsForSender = await this.friendService.getFriends(senderId);
      this.server.emit('friend-request-received', acceptRequest);
      this.server.to(`${userId}`).emit('friend', friendsForAccepter);
      this.server.to(`${senderId}`).emit('friend', friendsForSender);
    } catch (error) {
      console.error('Error accepting friend request gateway', error);
    }
  }

  @SubscribeMessage('decline-friend-request')
  async declineFriendRequest(
    client: Socket,
    data: { userId: number; friendRequestId: number },
  ) {
    try {
      const { userId, friendRequestId } = data;
      const declinedRequest = await this.friendService.declineFriendRequest(
        friendRequestId,
      );
      this.server.emit('friend-request-received', declinedRequest);
      // this.getReceiveFriendRequest(userId);
    } catch (error) {
      console.error('Error declining friend request gateway', error);
    }
  }

  @SubscribeMessage('unfriend')
  async unfriend(client: Socket, data: { userId: number; friendId: number }) {
    try {
      const { userId, friendId } = data;
      const frienship = await this.friendService.findFriendship(
        userId,
        friendId,
      );
      const unfriendRequest = await this.friendService.unFriend(frienship.id);
      this.server.to(`${friendId}`).emit('unfriend', userId);
      this.server.to(`${userId}`).emit('unfriend', friendId);
      this.server.emit('friend-request-received', unfriendRequest);
    } catch (error) {
      console.error('Error unfriending gateway', error);
    }
  }

  @SubscribeMessage('block')
  async block(client: Socket, data: { blockerId: number; friendId: number }) {
    try {
      const { blockerId, friendId } = data;
      const frienship = await this.friendService.findFriendship(
        blockerId,
        friendId,
      );
      const blockRequest = await this.friendService.blockUser(
        frienship.id,
        blockerId,
        friendId,
      );
      const blockListSender = await this.friendService.getBlockedUsers(
        blockerId,
      );
      const blockListReceiver = await this.friendService.getBlockedUsers(
        friendId,
      );
      this.server.to(`${blockerId}`).emit('block', blockListSender);
      this.server.to(`${friendId}`).emit('unfriend', blockerId);
      this.server.to(`${blockerId}`).emit('unfriend', friendId);
      this.server.emit('friend-request-received', blockRequest);
    } catch (error) {
      console.error('Error blocking gateway', error);
    }
  }

  @SubscribeMessage('unblock')
  async unblock(
    client: Socket,
    data: { unBlockerId: number; blockId: number },
  ) {
    try {
      const { unBlockerId, blockId } = data;
      const unblockRequest = await this.friendService.findFriendship(
        unBlockerId,
        blockId,
      );
      const acceptRequest = await this.friendService.unblock(unblockRequest.id);
      const friendsForAccepter = await this.friendService.getFriends(
        unBlockerId,
      );
      const friendsForSender = await this.friendService.getFriends(blockId);
      this.server.to(`${unBlockerId}`).emit('friend', friendsForAccepter);
      this.server.to(`${blockId}`).emit('friend', friendsForSender);
      // this.server.to(`${blockId}`).emit('unblock', blockId);
      this.server.to(`${unBlockerId}`).emit('unblock', blockId);
      // this.server.to(`${blockId}`).emit('block', null);
      this.server.emit('friend-request-received', acceptRequest);
      // this.server.emit('friend-request-received', unblockRequest);
    } catch (error) {
      console.error('Error unblocking gateway', error);
    }
  }
}
