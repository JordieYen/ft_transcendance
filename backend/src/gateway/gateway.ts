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

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('connected');
        });
    }

    // sendFriendRequest(senderId: number, receiverId: number) {
    //     const senderSocket = this.server.sockets.sockets.get(senderId.toString());
    //     const receiverSocket = this.server.sockets.sockets.get(receiverId.toString());
    //     receiverSocket.emit('friend-request-received', receiverId);
    //     senderSocket.emit('friend-request-sent', senderId);
    // }

    @SubscribeMessage('friend-request-sent')
    async handleFriendRequestSent(client: Socket, data: { senderId: number, receiverId: number }) {
        try {
            console.log('friend request sent');
            
            const { senderId, receiverId } = data;
            await this.sendFriendRequest(senderId, receiverId);
            await this.getFriendRequest(senderId);

        } catch (error) {
            console.error('Error sending friend request gateway', error);
        }
    }

    @SubscribeMessage('cancel-friend-request')
    async handleCancelFriendRequest(client: Socket, data: {senderId: number, friendRequestId: number} ) {
        try {
            const { senderId, friendRequestId } = data;
            const cancelRequest = await this.friendService.cancelFriendRequest(friendRequestId);
            this.server.emit('friend-request-received', cancelRequest);
            await this.getFriendRequest(senderId);
        } catch (error) {
            console.error('Error canceling friend request gateway', error);
        }
    }

    @SubscribeMessage('friend-request-received')
    async sendFriendRequest(senderId: number, receiverId: number) {
        console.log('friend request received');
        const friendRequest = await this.friendService.sendFriendRequest(senderId, receiverId);
        // console.log('friend', friendRequest);
        this.server.emit('friend-request-received', friendRequest);

    }

    @SubscribeMessage('friend-request')
    async getFriendRequest(senderId: number) {
        console.log('get friend request');
        // const friendRequests = await this.friendService.getFriendRequests(senderId);
        // here need to change idea to send
        const friendRequests = await this.friendService.getReceivedFriendRequest(senderId);
        console.log('friends', friendRequests);
        this.server.emit('friend-request', friendRequests);
    }


    @SubscribeMessage('accept-friend-request')
    async acceptFriendRequest(client: Socket, data: { userId: number, friendRequestId: number }) {
        try {
            const { userId, friendRequestId } = data;
            console.log('gateway', friendRequestId);
            const acceptedRequest = await this.friendService.acceptFriendRequest(friendRequestId);
            // this.server.emit('friend-request-accepted', acceptedRequest);
            this.server.emit('friend-request-received', acceptedRequest);
            this.getFriendRequest(userId);

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
            this.getFriendRequest(userId);
        } catch (error) {
            console.error('Error declining friend request gateway', error);
        }
    }
    
}
