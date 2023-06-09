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
            console.log('cancel friend request');
            
            const { senderId, friendRequestId } = data;
            await this.friendService.cancelFriendRequest(friendRequestId);
            await this.getFriendRequest(senderId);
        } catch (error) {
            console.error('Error canceling friend request gateway', error);
        }
    }

    // @SubscribeMessage('friend-request-received')
    async sendFriendRequest(senderId: number, receiverId: number) {
        console.log('send friend request');
        const friendRequest = await this.friendService.sendFriendRequest(senderId, receiverId);
        console.log('friend', friendRequest);
        this.server.emit('friend-request-received', friendRequest);

    }

    @SubscribeMessage('friend-request')
    async getFriendRequest(senderId: number) {
        console.log('get friend request');
        const friendRequests = await this.friendService.getFriendRequests(senderId);
        console.log('friends', friendRequests);
        this.server.emit('friend-request', friendRequests);
    }
    
}
