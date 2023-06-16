import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import cors from "cors";
import { Socket } from "dgram";
import { Server } from 'socket.io';
import { FriendService } from "src/friend/services/friend.service";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:3001",
    },
})
export class MyGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly friendService: FriendService,
    ) {}

    async onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('connected');

            socket.on('join', async (userId) => {
                console.log("User joined room: " + userId);
                socket.join(userId);
                const friendRequests = await this.friendService.getReceivedFriendRequest(userId);
                socket.to(userId).emit('friend-request', friendRequests);
            });
        });
    }

    @SubscribeMessage('friend-request-sent')
    async handleFriendRequestSent(client: Socket, data: { senderId: number, receiverId: number }) {
        try {
            console.log('friend request sent');
            const { senderId, receiverId } = data;
            await this.sendFriendRequest(senderId, receiverId);
            // await this.getReceiveFriendRequest(receiverId);
        } catch (error) {
            console.error('Error sending friend request gateway', error);
        }
    }

    @SubscribeMessage('friend-request-cancel')
    async handleCancelFriendRequest(client: Socket, data: {senderId: number, friendRequestId: number} ) {
        try {
            const { senderId, friendRequestId } = data;
            const cancelRequest = await this.friendService.cancelFriendRequest(friendRequestId);
            this.server.emit('friend-request-received', cancelRequest);
            // await this.getReceiveFriendRequest(senderId);
        } catch (error) {
            console.error('Error canceling friend request gateway', error);
        }
    }

    @SubscribeMessage('friend-request-received')
    async sendFriendRequest(senderId: number, receiverId: number) {
        console.log('friend request received');
        const friendRequest = await this.friendService.sendFriendRequest(senderId, receiverId);
        this.server.emit('friend-request-received', friendRequest);
    }

    async getSentFriendRequest(senderId: number) {
        console.log('get sent friend request');
        const friendRequests = await this.friendService.getSentFriendRequest(senderId);
        this.server.emit('friend-request-received', friendRequests);
    }

    @SubscribeMessage('friend-request')
    async getReceiveFriendRequest(receiverId: number) {
        console.log('get friend request', receiverId);
        const friendRequests = await this.friendService.getReceivedFriendRequest(receiverId);
        // this.server.emit('friend-request', friendRequests);
        this.server.to(`${receiverId}`).emit('friend-request', friendRequests);
    }

    @SubscribeMessage('user-friend-request')
    async getUserReceiveFriendRequest(client: Socket, data: { userId: number }) {
        const { userId } = data;
        console.log('get friend request', userId);
        const friendRequests = await this.friendService.getReceivedFriendRequest(userId);
        // this.server.emit('friend-request', friendRequests);
        this.server.to(`${userId}`).emit('friend-request', friendRequests);
    }

    @SubscribeMessage('accept-friend-request')
    async acceptFriendRequest(client: Socket, data: { userId: number, friendRequestId: number }) {
        try {
            const { userId, friendRequestId } = data;
            console.log('gateway', friendRequestId);
            const acceptedRequest = await this.friendService.acceptFriendRequest(friendRequestId);
            this.server.emit('friend-request-received', acceptedRequest);
            this.getReceiveFriendRequest(userId);

        } catch (error) {
            console.error('Error accepting friend request gateway', error);
        };
    }

    @SubscribeMessage('decline-friend-request')
    async declineFriendRequest(client: Socket, data: { userId: number, friendRequestId: number }) {
        try {
            const { userId, friendRequestId } = data;
            const declinedRequest = await this.friendService.declineFriendRequest(friendRequestId);
            this.server.emit('friend-request-received', declinedRequest);
            this.getReceiveFriendRequest(userId);
        } catch (error) {
            console.error('Error declining friend request gateway', error);
        }
    }
    
}
