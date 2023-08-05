import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from 'src/game/game.service';
import { Socket, Server } from 'socket.io';
import {
  GameInfo,
  MovePaddleParams,
  StartGameParams,
  UserData,
  InitializeGameParam,
  EndGameParams,
} from 'src/game/game.interface';

@WebSocketGateway({
  cors: {
    // origin: 'http://localhost:3001',
    // origin: `${process.env.NEXT_HOST}`,
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  rooms: Map<string, UserData[]> = new Map<string, UserData[]>();
  gameInfo: Map<string, GameInfo> = new Map<string, GameInfo>();

  constructor(private readonly gameService: GameService) {}

  async onModuleInit() {
    // does something on Game Module init
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, data: { user: UserData }) {
    data.user.socketId = client.id;
    this.gameService.joinRooms({
      server: this.server,
      client: client,
      rooms: this.rooms,
      user: data.user,
    });
  }

  @SubscribeMessage('clear-room')
  clearRoom(client: Socket, data: { roomId: string; user: UserData }) {
    this.gameService.leaveRoom({
      server: this.server,
      roomId: data.roomId,
      roomArray: this.rooms,
      gameArray: this.gameInfo,
      gameInfo: this.gameInfo.get(data.roomId),
      user: data.user,
    });
  }

  @SubscribeMessage('initialize-game')
  async initializeGame(client: Socket, data: InitializeGameParam) {
    this.gameInfo.set(data.roomId, this.gameService.initializeGame(data));
  }

  @SubscribeMessage('mouse-position')
  async movePaddle(client: Socket, data: MovePaddleParams) {
    this.gameService.updatePaddlePos({
      server: this.server,
      roomId: data.roomId,
      player: data.player,
      mouseY: data.mouseY,
      gameInfo: this.gameInfo.get(data.roomId),
      gameProperties: data.gameProperties,
    });
  }

  @SubscribeMessage('start-game')
  async startGame(client: Socket, data: StartGameParams) {
    if (this.gameInfo.get(data.roomId).gameStart < 1) {
      this.gameService.handleGameState({
        server: this.server,
        roomId: data.roomId,
        roomArray: this.rooms,
        gameArray: this.gameInfo,
        gameInfo: this.gameInfo.get(data.roomId),
        gameProperties: data.gameProperties,
      });
      if (this.gameInfo.get(data.roomId).gameStart < 3)
        this.gameInfo.get(data.roomId).gameStart++;
    }
  }

  @SubscribeMessage('end-game')
  async endGame(client: Socket, data: EndGameParams) {
    this.gameService.gameOver({
      server: this.server,
      roomId: data.roomId,
      roomArray: this.rooms,
      gameArray: this.gameInfo,
      gameInfo: this.gameInfo.get(data.roomId),
      gameProperties: data.gameProperties,
    });
  }

  @SubscribeMessage('invite-game')
  async handleInviteGame(
    client: Socket,
    data: { user: UserData; friend: UserData },
  ) {
    const user = data.user;
    const friend = data.friend;
    client.to(friend.id.toString()).emit('invite-game', { user, friend });
  }

  @SubscribeMessage('accept-game-invitation')
  async handleAcceptGameInvitation(
    client: Socket,
    data: { user: UserData; friend: UserData },
  ) {
    const user = data.user;
    const friend = data.friend;

    const roomId = this.gameService.generateRoomId(this.rooms);
    this.rooms.set(roomId, [user, friend]);

    client.join(roomId);
    client.to(friend.id.toString()).emit('joined-room', roomId);

    // const playersData = [user, friend].map((player) => ({ player: player }));
    // this.server.to(roomId).emit('to-loading-screen', { roomId, playersData });
    this.server.to(roomId).emit('to-loading-screen', {
      roomId,
      player1User: user,
      player2User: friend,
    });
    this.server
      .to(user.id.toString())
      // .emit('to-loading-screen', { roomId, playersData });
      .emit('to-loading-screen', {
        roomId,
        player1User: user,
        player2User: friend,
      });
    this.gameService.logRooms(this.rooms);
  }

  handleDisconnect() {
    console.log('disconnected from game socket gateway');
  }
}
