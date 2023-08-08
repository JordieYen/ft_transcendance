import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Engine, Runner, Bodies, Composite, Body, World } from 'matter-js';
import {
  GameElements,
  LeaveRoomParams,
  UpdatePaddleParams,
  Paddle,
  UserData,
  HandleGameStateParams,
  JoinRoomParams,
  InitializeGameParams,
  AcceptGameInvitationParams,
  DeclineGameInvitationParams,
} from './game.interface';
import { FriendService } from 'src/friend/services/friend.service';
import { MatchHistoryService } from 'src/match-history/services/match-history.service';

@Injectable()
export class GameService {
  constructor(
    private readonly friendService: FriendService,
    private readonly matchHistoryService: MatchHistoryService,
  ) {}

  /* generate a room with unique id */
  generateRoomId(rooms: Map<string, UserData[]>) {
    const roomIdLength = 3;
    const roomId = randomBytes(roomIdLength)
      .toString('hex')
      .slice(0, roomIdLength);
    rooms.set(roomId, []);
    return roomId;
  }

  /* log rooms */
  logRooms(rooms: Map<string, UserData[]>) {
    for (const [roomId, players] of rooms.entries()) {
      const usernames = players.map((player) => player.username).join(', ');
      console.log(`Room ${roomId}: [${usernames}]`);
    }
  }

  /* returns available rooms */
  findAvailableRoom(rooms: Map<string, UserData[]>) {
    for (const [roomId, roomPlayers] of rooms) {
      if (roomPlayers.length < 2) {
        return { roomId, roomPlayers };
      }
    }
    return {};
  }

  /* returns available rooms by id */
  findAvailableRoomById(rooms: Map<string, UserData[]>, uid: number) {
    for (const [roomId, roomPlayers] of rooms) {
      if (roomPlayers.length < 2 && roomPlayers[0].id === uid) {
        return { roomId, roomPlayers };
      }
    }
    return {};
  }

  /* join a user into a room */
  async joinRooms(param: JoinRoomParams) {
    let { roomId, roomPlayers } = this.findAvailableRoom(param.rooms);

    // check if user is already in a room
    for (const [existingRoomId, existingRoomPlayers] of param.rooms) {
      if (existingRoomPlayers.includes(param.user)) {
        console.log(
          'User is already in a room',
          param.user.username,
          existingRoomId,
        );
        roomId = existingRoomId;
        param.client.emit('in-room', roomId);
        return;
      }
    }

    // create a room and place player in room
    if (!roomId && !roomPlayers) {
      roomId = this.generateRoomId(param.rooms);
      roomPlayers = [param.user];
      param.rooms.set(roomId, roomPlayers);
    } else roomPlayers.push(param.user);
    param.client.join(roomId);
    param.client.emit('joined-room', roomId);

    // update friends in game status
    const friends = await this.friendService.getFriendsBoth(param.user.id);
    for (const friend of friends) {
      console.log('Friend: ', friend);
      await this.friendService.update(friend.id, {
        ...friend,
        roomId: roomId,
      });
    }

    // start game if room has 2 players
    if (roomPlayers.length === 2) {
      const playersData = roomPlayers.map((player) => ({
        player: player,
      }));
      param.server
        .to(roomId)
        .emit('loading-screen', { roomId, players: playersData });
    }
    this.logRooms(param.rooms);
  }

  /* invite player into a game and join a room */
  inviteGame(param: AcceptGameInvitationParams) {
    param.client
      .to(param.pTwo.id.toString())
      .emit('invite-game', { user: param.pOne, friend: param.pTwo });

    // temporary join private room
    this.joinRooms({
      server: param.server,
      client: param.client,
      rooms: param.rooms,
      user: param.pOne,
    });
    const intervalId = setInterval(() => {
      this.declineInvitation({
        server: param.server,
        rooms: param.rooms,
        user: param.pOne,
      });
    }, 5000);
    clearInterval(intervalId);
  }

  /* put both players into a room after accepting invitation */
  async acceptInvitation(param: AcceptGameInvitationParams) {
    const { roomId, roomPlayers } = this.findAvailableRoomById(
      param.rooms,
      param.pOne.id,
    );

    roomPlayers.push(param.pTwo);
    param.client.join(roomId);
    param.client.to(param.pTwo.id.toString()).emit('joined-room', roomId);

    // update friends in game status
    const friends = await this.friendService.getFriendsBoth(param.pTwo.id);
    for (const friend of friends) {
      console.log('Friend: ', friend);
      await this.friendService.update(friend.id, {
        ...friend,
        roomId: roomId,
      });
    }

    param.server.to(roomId).emit('to-loading-screen', {
      roomId,
      player1User: param.pOne,
      player2User: param.pTwo,
    });
    param.server.to(param.pOne.id.toString()).emit('to-loading-screen', {
      roomId,
      player1User: param.pOne,
      player2User: param.pTwo,
    });
    this.logRooms(param.rooms);
  }

  /* remove inviter from private room after invitee declines invitation */
  declineInvitation(param: DeclineGameInvitationParams) {
    console.log('Declined Game Invitation');
    const { roomId } = this.findAvailableRoomById(param.rooms, param.user.id);
    this.clearRoomIdInFriend(param.user.id);
    param.rooms.delete(roomId);
    param.server.to(roomId).emit('room-closed');
  }

  /* check if player exists in room, if one player exist, send opponent-disconnected */
  leaveRoom(param: LeaveRoomParams) {
    const roomPlayers = param.rooms.get(param.roomId);
    if (roomPlayers) {
      const remainingPlayer = roomPlayers.find(
        (player) => player !== param.user,
      );

      if (remainingPlayer) {
        param.server.to(param.roomId).emit('opponent-disconnected');
      }
      const updatedRoomPlayers = roomPlayers.filter((player) => {
        player !== param.user;
      });
      // console.log('updated room player', updatedRoomPlayers);
      param.rooms.set(param.roomId, updatedRoomPlayers);

      // if room is empty, delete room and emit room-closed
      if (updatedRoomPlayers.length === 0) {
        this.gameOver({
          server: param.server,
          roomId: param.roomId,
          rooms: param.rooms,
          games: param.games,
          gameInfo: param.gameInfo,
          gameProperties: null,
        });
        param.server.to(param.roomId).emit('room-closed');
      }
    }
  }

  /* initialize game engine */
  initializeEngine() {
    const engine = Engine.create();
    const runner = Runner.create();

    engine.gravity.y = 0;
    Runner.run(runner, engine);

    return engine;
  }

  /* initializes window border */
  initializeBorders(engine: Engine, gameProperties: GameElements) {
    const topBorder = Bodies.rectangle(
      gameProperties.border.x / 2,
      0 - gameProperties.border.y / 2,
      gameProperties.border.x,
      gameProperties.border.y,
      { isStatic: true },
    );

    const botBorder = Bodies.rectangle(
      gameProperties.border.x / 2,
      gameProperties.screen.y + gameProperties.border.y / 2,
      gameProperties.border.x,
      gameProperties.border.y,
      { isStatic: true },
    );

    /* add borders into world */
    Composite.add(engine.world, [topBorder, botBorder]);
  }

  /* initializes paddle */
  initializePaddle(engine: Engine, paddleInfo: Paddle) {
    const paddle = Bodies.rectangle(
      paddleInfo.position.x,
      paddleInfo.position.y,
      paddleInfo.width,
      paddleInfo.height,
      { isStatic: true },
    );

    /* add paddle into world */
    Composite.add(engine.world, [paddle]);

    return paddle;
  }

  /* initializes ball */
  initializeBall(engine: Engine, gameProperties: GameElements) {
    const ball = Bodies.circle(
      gameProperties.ball.position.x,
      gameProperties.ball.position.y,
      gameProperties.ball.radius,
      {
        density: 0.001,
        mass: 0,
        restitution: 1,
        friction: 0,
        frictionAir: 0,
      },
    );
    Body.setVelocity(ball, { x: 0, y: 0 });

    /* add paddle into world */
    Composite.add(engine.world, [ball]);

    return ball;
  }

  /* initilizes Game */
  initializeGame(param: InitializeGameParams) {
    const pOneId = param.pOneId;
    const pTwoId = param.pTwoId;
    const gameStart = 0;
    const pOneScore = 0;
    const pTwoScore = 0;
    const pOneSmash = 0;
    const pTwoSmash = 0;
    const engine = this.initializeEngine();
    this.initializeBorders(engine, param.gameProperties);
    const leftPaddle = this.initializePaddle(
      engine,
      param.gameProperties.leftPaddle,
    );
    const rightPaddle = this.initializePaddle(
      engine,
      param.gameProperties.rightPaddle,
    );
    const ball = this.initializeBall(engine, param.gameProperties);
    console.log('Game started');
    return {
      engine,
      leftPaddle,
      rightPaddle,
      ball,
      pOneId,
      pTwoId,
      gameStart,
      pOneScore,
      pTwoScore,
      pOneSmash,
      pTwoSmash,
    };
  }

  /* check if mouse position is out of bounds */
  checkMousePosOutOfBounds(param: UpdatePaddleParams) {
    if (param.mouseY < param.gameProperties.leftPaddle.height / 2)
      return param.gameProperties.leftPaddle.height / 2;
    else if (
      param.mouseY >
      param.gameProperties.screen.y - param.gameProperties.leftPaddle.height / 2
    )
      return (
        param.gameProperties.screen.y -
        param.gameProperties.leftPaddle.height / 2
      );
    else return 0;
  }

  /* update paddle movement with given input */
  updatePaddlePos(param: UpdatePaddleParams) {
    /* set paddle to not go out of bounds */
    const mousePos = this.checkMousePosOutOfBounds(param);
    if (mousePos) param.mouseY = mousePos;
    if (param.player === 'p1') {
      Body.setPosition(param.gameInfo.leftPaddle, {
        x: param.gameProperties.leftPaddle.position.x,
        y: param.mouseY,
      });
    }
    if (param.player === 'p2') {
      Body.setPosition(param.gameInfo.rightPaddle, {
        x: param.gameProperties.rightPaddle.position.x,
        y: param.mouseY,
      });
    }
    param.server
      .to(param.roomId)
      .emit('left-paddle-position', param.gameInfo.leftPaddle.position);
    param.server
      .to(param.roomId)
      .emit('right-paddle-position', param.gameInfo.rightPaddle.position);
  }

  /* clear roomId in friend */
  async clearRoomIdInFriend(id: number) {
    const friends = await this.friendService.getFriendsBoth(id);
    for (const friend of friends) {
      await this.friendService.update(friend.id, {
        ...friend,
        roomId: null,
      });
    }
  }

  /* ends game and remove everything */
  gameOver(param: HandleGameStateParams) {
    if (param.gameInfo) {
      World.clear(param.gameInfo.engine.world, true);
      Engine.clear(param.gameInfo.engine);
      this.clearRoomIdInFriend(param.gameInfo.pOneId);
      this.clearRoomIdInFriend(param.gameInfo.pTwoId);
    }
    param.games.delete(param.roomId);
    param.rooms.delete(param.roomId);
    param.server.to(param.roomId).emit('room-closed');
  }

  /* set winner uid, create match-history, end game */
  handleGameEnd(param: HandleGameStateParams) {
    if (param.gameInfo.pOneScore == 11 || param.gameInfo.pTwoScore == 11) {
      let winner_uid = 0;
      if (param.gameInfo.pOneScore == 11) winner_uid = param.gameInfo.pOneId;
      else winner_uid = param.gameInfo.pTwoId;

      this.matchHistoryService.create({
        winner_uid: winner_uid,
        p1: param.gameInfo.pOneId,
        p2: param.gameInfo.pTwoId,
        p1_score: param.gameInfo.pOneScore,
        p2_score: param.gameInfo.pTwoScore,
        p1_smashes: param.gameInfo.pOneSmash,
        p2_smashes: param.gameInfo.pTwoSmash,
        p1_mmr: 1000,
        p2_mmr: 1000,
      });

      param.server.to(param.roomId).emit('game-over');
      console.log('Game Over');
      this.gameOver(param);
    }
  }

  /* update score */
  updateScore(param: HandleGameStateParams) {
    if (param.gameInfo.ball.position.x < 0 && param.gameInfo.pTwoScore < 11) {
      param.gameInfo.pTwoScore++;
      return 2;
    }
    if (
      param.gameInfo.ball.position.x > param.gameProperties.screen.x &&
      param.gameInfo.pOneScore < 11
    ) {
      param.gameInfo.pOneScore++;
      return 1;
    }
    return 0;
  }

  /* reset ball position if out of bounds */
  resetBallPosition(param: HandleGameStateParams) {
    const winner = this.updateScore(param);
    const ballYPos = param.gameInfo.ball.position.y;
    Body.setPosition(param.gameInfo.ball, {
      x: param.gameProperties.screen.x / 2,
      y: param.gameProperties.screen.y / 2,
    });
    Body.setVelocity(param.gameInfo.ball, {
      x: 0,
      y: 0,
    });
    param.server.to(param.roomId).emit('reset-ball-speed');
    param.server.to(param.roomId).emit('reset-ball-position');
    param.server.to(param.roomId).emit('update-score', {
      winner: winner,
      ballYPos: ballYPos / param.gameProperties.screen.y,
      pOneScore: param.gameInfo.pOneScore,
      pTwoScore: param.gameInfo.pTwoScore,
    });
    param.gameInfo.gameStart = 0;
  }

  /* check if ball goes out of bounds */
  checkBallOutOfBounds(param: HandleGameStateParams) {
    if (
      param.gameInfo.ball.position.x < -100 ||
      param.gameInfo.ball.position.x > param.gameProperties.screen.x + 100
    ) {
      return 1;
    }
    return 0;
  }

  /* check if ball in starting position */
  checkBallStartPos(param: HandleGameStateParams) {
    if (
      param.gameInfo.ball.position.x === param.gameProperties.screen.x / 2 &&
      param.gameInfo.ball.position.y === param.gameProperties.screen.y / 2
    ) {
      return 1;
    }
    return 0;
  }

  /* start round */
  startRound(param: HandleGameStateParams) {
    const startGameInterval = setInterval(() => {
      param.server
        .to(param.roomId)
        .emit('ball-position', param.gameInfo.ball.position);
      if (this.checkBallOutOfBounds(param)) {
        this.resetBallPosition(param);
        this.handleGameEnd(param);
      }
      if (this.checkBallStartPos(param)) {
        clearInterval(startGameInterval);
      }
    }, 50);
  }

  /* handle game when it starts */
  handleGameState(param: HandleGameStateParams) {
    param.server
      .to(param.roomId)
      .emit('ball-speed', param.gameProperties.ball.speed);
    Body.setVelocity(param.gameInfo.ball, {
      x: param.gameProperties.ball.speed.x,
      y: param.gameProperties.ball.speed.y,
    });
    this.startRound(param);
  }
}
