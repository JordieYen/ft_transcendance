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
            const { senderId, receiverId } = data;
            await this.friendService.sendFriendRequest(senderId, receiverId);
        } catch (error) {
            console.error('Error sending friend request gateway', error);
        }
    }

    @SubscribeMessage('cancel-friend-request')
    async handleCancelFriendRequest(client: Socket, friendRequestId: number) {
        try {
            await this.friendService.cancelFriendRequest(friendRequestId);
        } catch (error) {
            console.error('Error canceling friend request gateway', error);
        }
    }
    
}
