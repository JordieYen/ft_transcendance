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
  GameParams,
  MovePaddleParams,
  InitializeGameParams,
  GameInvitationParams,
  SmashingPaddleParams,
} from 'src/game/game.interface';
import { FriendService } from 'src/friend/services/friend.service';

@WebSocketGateway({
  cors: {
    // origin: 'http://localhost:3001',
    // origin: `${process.env.NEXT_HOST}`,
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  classicRooms: Map<string, UserData[]> = new Map<string, UserData[]>();
  rankingRooms: Map<string, UserData[]> = new Map<string, UserData[]>();
  privateRooms: Map<string, UserData[]> = new Map<string, UserData[]>();
  gameInfo: Map<string, GameInfo> = new Map<string, GameInfo>();

  constructor(
    private readonly gameService: GameService,
    private readonly friendService: FriendService,
  ) {}

  onModuleInit() {
    // does something on Game Module init
  }

  @SubscribeMessage('join-room')
  async JoinRoom(client: Socket, param: { user: UserData; gameMode: string }) {
    param.user.socketId = client.id;
    const currentRoom = this.gameService.checkGameMode({
      user: param.user,
      gameMode: param.gameMode,
      classicRooms: this.classicRooms,
      rankingRooms: this.rankingRooms,
      privateRooms: this.privateRooms,
    });
    if (currentRoom) {
      this.gameService.joinRooms({
        server: this.server,
        client: client,
        rooms: currentRoom,
        user: param.user,
      });
    }
  }

  @SubscribeMessage('view-game')
  async viewGame(client: Socket, param: { roomId: string }) {
    client.join(param.roomId);
    const gameState = this.gameService.findAvailableRoomByRoomId({
      roomId: param.roomId,
      rooms: [this.classicRooms, this.rankingRooms, this.privateRooms],
    });
    this.server.to(param.roomId).emit('game-update', gameState);
  }

  @SubscribeMessage('invite-game')
  async inviteGame(client: Socket, param: GameInvitationParams) {
    const friendId = await param.friend?.id;
    const test = await this.friendService.getGameStatus(friendId);
    if (test.length == 0) {
      console.log('invite sent');
      param.user.socketId = client.id;
      param.user.gameMode = 'private';
      this.gameService.inviteGame({
        server: this.server,
        client: client,
        rooms: this.privateRooms,
        pOne: param.user,
        pTwo: param.friend,
      });
    }
  }

  @SubscribeMessage('accept-game-invitation')
  acceptGameInvitation(client: Socket, param: GameInvitationParams) {
    param.friend.socketId = client.id;
    param.friend.gameMode = 'private';
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
    param.user.gameMode = null;
    param.friend.gameMode = null;
    this.gameService.declineInvitation({
      server: this.server,
      rooms: this.privateRooms,
      user: param.user,
    });
  }

  @SubscribeMessage('clear-room')
  clearRoom(client: Socket, param: { roomId: string; user: UserData }) {
    const currentRoom = this.gameService.getGameMode({
      gameMode: param.user.gameMode,
      classicRooms: this.classicRooms,
      rankingRooms: this.rankingRooms,
      privateRooms: this.privateRooms,
    });
    if (currentRoom) {
      this.gameService.leaveRoom({
        client: client,
        server: this.server,
        roomId: param.roomId,
        rooms: currentRoom,
        games: this.gameInfo,
        gameInfo: this.gameInfo.get(param.roomId),
        user: param.user,
      });
    }
    this.gameService.clearRoomIdInFriend(param.user.id);
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

  @SubscribeMessage('active-paddle')
  activePaddle(client: Socket, param: SmashingPaddleParams) {
    if (param.gameMode === 'custom') {
      this.gameService.updatePaddleActiveState({
        server: this.server,
        roomId: param.roomId,
        player: param.player,
        gameInfo: this.gameInfo.get(param.roomId),
        gameProperties: param.gameProperties,
      });
    }
  }

  @SubscribeMessage('passive-paddle')
  passivePaddle(client: Socket, param: SmashingPaddleParams) {
    if (param.gameMode === 'custom') {
      this.gameService.updatePaddlePassiveState({
        server: this.server,
        roomId: param.roomId,
        player: param.player,
        gameInfo: this.gameInfo.get(param.roomId),
        gameProperties: param.gameProperties,
      });
    }
  }

  @SubscribeMessage('start-game')
  async startGame(client: Socket, param: GameParams) {
    // const p1 = await this.gameInfo.get(param.roomId).pOneId;
    // const p2 = await this.gameInfo.get(param.roomId).pTwoId;
    // console.log(p1, p2);
    // await this.friendService.updateRoomId(p1, p2);
    const roundWinner = this.gameInfo.get(param.roomId).roundWinner;
    if (roundWinner === null || roundWinner === param.player) {
      if (this.gameInfo.get(param.roomId).gameStart < 1) {
        const currentRoom = this.gameService.getGameMode({
          gameMode: param.gameMode,
          classicRooms: this.classicRooms,
          rankingRooms: this.rankingRooms,
          privateRooms: this.privateRooms,
        });
        if (currentRoom) {
          this.gameService.handleGameState({
            client: client,
            server: this.server,
            roomId: param.roomId,
            player: param.player,
            rooms: currentRoom,
            games: this.gameInfo,
            gameInfo: this.gameInfo.get(param.roomId),
            gameProperties: param.gameProperties,
          });
        }
      }
      if (this.gameInfo.get(param.roomId).gameStart < 3)
        this.gameInfo.get(param.roomId).gameStart++;
    }
  }

  handleDisconnect() {
    // does something on Module disconnect
  }
}
