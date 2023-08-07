import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from 'src/game/game.service';
import { Socket, Server } from 'socket.io';
import {
  UserData,
  GameInfo,
  StartGameParams,
  EndGameParams,
  MovePaddleParams,
  InitializeGameParams,
  GameInvitationParams,
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
  privateRooms: Map<string, UserData[]> = new Map<string, UserData[]>();
  gameInfo: Map<string, GameInfo> = new Map<string, GameInfo>();

  constructor(private readonly gameService: GameService) {}

  onModuleInit() {
    // does something on Game Module init
  }

  @SubscribeMessage('join-room')
  JoinRoom(client: Socket, data: { user: UserData }) {
    data.user.socketId = client.id;
    this.gameService.joinRooms({
      server: this.server,
      client: client,
      rooms: this.rooms,
      user: data.user,
    });
  }

  @SubscribeMessage('invite-game')
  inviteGame(client: Socket, param: GameInvitationParams) {
    param.user.socketId = client.id;
    this.gameService.inviteGame({
      server: this.server,
      client: client,
      rooms: this.privateRooms,
      pOne: param.user,
      pTwo: param.friend,
    });
  }

  @SubscribeMessage('accept-game-invitation')
  acceptGameInvitation(client: Socket, param: GameInvitationParams) {
    param.friend.socketId = client.id;
    this.gameService.acceptInvitation({
      server: this.server,
      client: client,
      rooms: this.privateRooms,
      pOne: param.user,
      pTwo: param.friend,
    });
  }

  @SubscribeMessage('decline-game-invitation')
  declineGameInvitation(client: Socket, param: GameInvitationParams) {
    param.friend.socketId = client.id;
    this.gameService.declineInvitation({
      server: this.server,
      rooms: this.privateRooms,
      user: param.user,
    });
  }

  @SubscribeMessage('clear-room')
  clearRoom(client: Socket, param: { roomId: string; user: UserData }) {
    this.gameService.leaveRoom({
      server: this.server,
      roomId: param.roomId,
      rooms: this.rooms,
      games: this.gameInfo,
      gameInfo: this.gameInfo.get(param.roomId),
      user: param.user,
    });
  }

  @SubscribeMessage('initialize-game')
  initializeGame(client: Socket, param: InitializeGameParams) {
    this.gameInfo.set(param.roomId, this.gameService.initializeGame(param));
  }

  @SubscribeMessage('mouse-position')
  movePaddle(client: Socket, param: MovePaddleParams) {
    this.gameService.updatePaddlePos({
      server: this.server,
      roomId: param.roomId,
      player: param.player,
      mouseY: param.mouseY,
      gameInfo: this.gameInfo.get(param.roomId),
      gameProperties: param.gameProperties,
    });
  }

  @SubscribeMessage('start-game')
  startGame(client: Socket, param: StartGameParams) {
    if (this.gameInfo.get(param.roomId).gameStart < 1) {
      this.gameService.handleGameState({
        server: this.server,
        roomId: param.roomId,
        rooms: this.rooms,
        games: this.gameInfo,
        gameInfo: this.gameInfo.get(param.roomId),
        gameProperties: param.gameProperties,
      });
      if (this.gameInfo.get(param.roomId).gameStart < 3)
        this.gameInfo.get(param.roomId).gameStart++;
    }
  }

  @SubscribeMessage('end-game')
  endGame(client: Socket, param: EndGameParams) {
    this.gameService.gameOver({
      server: this.server,
      roomId: param.roomId,
      rooms: this.rooms,
      games: this.gameInfo,
      gameInfo: this.gameInfo.get(param.roomId),
      gameProperties: param.gameProperties,
    });
  }

  handleDisconnect() {
    console.log('disconnected from game socket gateway');
  }
}
