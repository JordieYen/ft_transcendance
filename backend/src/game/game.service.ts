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
  CheckGameModeParams,
  UpdatePaddleActiveStateParams,
  UpdatePaddlePassiveStateParams,
  FindRoomByIdParams,
  GetGameModeParams,
} from './game.interface';
import { FriendService } from 'src/friend/services/friend.service';
import { MatchHistoryService } from 'src/match-history/services/match-history.service';
import * as wavPlayer from 'node-wav-player';

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

  /* returns room by roomId */
  findAvailableRoomByRoomId(param: FindRoomByIdParams) {
    for (let i = 0; i < 3; ++i) {
      for (const [roomId, roomPlayers] of param.rooms[i]) {
        if (roomId === param.roomId)
          return {
            roomId,
            player1User: roomPlayers[0],
            player2User: roomPlayers[1],
          };
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

  /* set current room */
  checkGameMode(param: CheckGameModeParams) {
    param.user.gameMode = param.gameMode;
    if (param.gameMode === 'classic') return param.classicRooms;
    else if (param.gameMode === 'custom') return param.rankingRooms;
    else return null;
  }

  /* set current room */
  getGameMode(param: GetGameModeParams) {
    if (param.gameMode === 'classic') return param.classicRooms;
    else if (param.gameMode === 'custom') return param.rankingRooms;
    else if (param.gameMode === 'private') return param.rankingRooms;
    else return null;
  }

  /* join a user into a room */
  async joinRooms(param: JoinRoomParams) {
    let { roomId, roomPlayers } = this.findAvailableRoom(param.rooms);

    // check if user is already in a room
    const existingRoomId = this.findAvailableRoomById(
      param.rooms,
      param.user.id,
    ).roomId;
    if (existingRoomId) {
      console.log(
        'User is already in a room',
        param.user.username,
        existingRoomId,
      );
      param.client.emit('in-room', { roomId: existingRoomId });
      return;
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
    // const friends = await this.friendService.getFriendsBoth(param.user.id);
    // for (const friend of friends) {
    //   console.log('Friend: ', friend);
    //   await this.friendService.update(friend.id, {
    //     ...friend,
    //     roomId: roomId,
    //   });
    // }

    if (roomPlayers.length === 2) {
      const playersData = roomPlayers.map((player) => ({
        player: player,
      }));

      const p1 = playersData[0].player.id;
      const p2 = playersData[1].player.id;

      if (p1 != undefined && p2 != undefined) {
        await this.friendService.updateRoomId(p1, p2);
      }
    }

    if (roomPlayers.length === 2) {
      const playersData = roomPlayers.map((player) => ({
        player: player,
      }));

      const p1 = playersData[0].player.id;
      const p2 = playersData[1].player.id;

      console.log(p1, p2);
      if (p1 != undefined && p2 != undefined) {
        await this.friendService.updateRoomId(p1, p2);
      }
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
      .emit('invite-player', { user: param.pOne, friend: param.pTwo });

    // temporary join private room
    this.joinRooms({
      server: param.server,
      client: param.client,
      rooms: param.rooms,
      user: param.pOne,
    });
  }

  /* put both players into a room after accepting invitation */
  async acceptInvitation(param: AcceptGameInvitationParams) {
    const { roomId, roomPlayers } = this.findAvailableRoomById(
      param.rooms,
      param.pOne.id,
    );

    roomPlayers?.push(param.pTwo);
    param.client.join(roomId);

    param.client.to(param.pTwo.id.toString()).emit('joined-room', roomId);

    // update friends in game status
    // const friends = await this.friendService.getFriendsBoth(param.pTwo.id);
    // for (const friend of friends) {
    //   console.log('Friend: ', friend);
    //   await this.friendService.update(friend.id, {
    //     ...friend,
    //     roomId: roomId,
    //   });
    // }

    if (roomPlayers?.length === 2) {
      const playersData = roomPlayers.map((player) => ({
        player: player,
      }));

      const p1 = playersData[0].player.id;
      const p2 = playersData[1].player.id;

      if (p1 != undefined && p2 != undefined) {
        await this.friendService.updateRoomId(p1, p2);
      }
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
      param.server.to(param.roomId).emit('game-over');
      if (updatedRoomPlayers.length === 0) {
        this.gameOver({
          client: param.client,
          server: param.server,
          roomId: param.roomId,
          player: null,
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
    const pOnePing = 0;
    const pTwoPing = 0;
    const gameStart = 0;
    const pOneScore = 0;
    const pTwoScore = 0;
    const pOneSmash = 0;
    const pTwoSmash = 0;
    const ballSpeed = { x: 0, y: 0 };
    const roundWinner = null;
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
    return {
      engine,
      leftPaddle,
      rightPaddle,
      ball,
      pOneId,
      pTwoId,
      pOnePing,
      pTwoPing,
      gameStart,
      pOneScore,
      pTwoScore,
      pOneSmash,
      pTwoSmash,
      ballSpeed,
      roundWinner,
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
    if (param.player === 'p1' && param.gameInfo.leftPaddle) {
      Body.setPosition(param.gameInfo.leftPaddle, {
        x: param.gameInfo.leftPaddle.position.x,
        y: param.mouseY,
      });
      param.server
        .to(param.roomId)
        .emit('left-paddle-position', param.gameInfo.leftPaddle.position);
    }
    if (param.player === 'p2' && param.gameInfo.rightPaddle) {
      Body.setPosition(param.gameInfo.rightPaddle, {
        x: param.gameInfo.rightPaddle.position.x,
        y: param.mouseY,
      });
      param.server
        .to(param.roomId)
        .emit('right-paddle-position', param.gameInfo.rightPaddle.position);
    }
  }

  // updatePaddlePos(param: UpdatePaddleParams) {
  //   /* set paddle to not go out of bounds */
  //   const mousePos = this.checkMousePosOutOfBounds(param);
  //   if (mousePos) param.mouseY = mousePos;
  //   if (param.player === 'p1' && param.gameInfo.leftPaddle) {
  //     Body.setPosition(param.gameInfo.leftPaddle, {
  //       x: param.gameInfo.leftPaddle.position.x,
  //       y: param.mouseY,
  //     });
  //   }
  //   if (param.player === 'p2') {
  //     Body.setPosition(param.gameInfo.rightPaddle, {
  //       x: param.gameInfo.rightPaddle.position.x,
  //       y: param.mouseY,
  //     });
  //   }
  //   param.server
  //     .to(param.roomId)
  //     .emit('left-paddle-position', param.gameInfo.leftPaddle.position);
  //   param.server
  //     .to(param.roomId)
  //     .emit('right-paddle-position', param.gameInfo.rightPaddle.position);
  // }

  /* calculation on perfect timing sweetspot */
  checkPerfectTiming(param: UpdatePaddleActiveStateParams) {
    const pOnePing = param.gameInfo.pOnePing;
    const pTwoPing = param.gameInfo.pTwoPing;
    const ballPos = param.gameInfo.ball.position;
    const leftPaddlePos = param.gameInfo.leftPaddle.position;
    const rightPaddlePos = param.gameInfo.rightPaddle.position;
    const perfectHitZone = param.gameProperties.ball.perfectHitZone;
    const perfectHitDuration = param.gameProperties.ball.perfectHitDuration;

    if (pOnePing >= 1 && pOnePing <= perfectHitDuration) {
      if (
        ballPos.x > leftPaddlePos.x &&
        ballPos.x <= leftPaddlePos.x + perfectHitZone &&
        ballPos.y >= leftPaddlePos.y - perfectHitZone &&
        ballPos.y <= leftPaddlePos.y + perfectHitZone
      ) {
        param.gameInfo.pOneSmash++;
        Body.setVelocity(param.gameInfo.ball, {
          x: param.gameInfo.ball.speed * param.gameProperties.ball.smashSpeed,
          y: param.gameInfo.ballSpeed.y,
        });
        return;
      }
    }
    if (pTwoPing >= 1 && pTwoPing <= perfectHitDuration) {
      if (
        ballPos.x < rightPaddlePos.x &&
        ballPos.x >= rightPaddlePos.x - perfectHitZone &&
        ballPos.y <= rightPaddlePos.y + perfectHitZone &&
        ballPos.y >= rightPaddlePos.y - perfectHitZone
      ) {
        param.gameInfo.pTwoSmash++;
        Body.setVelocity(param.gameInfo.ball, {
          x: param.gameInfo.ball.speed * param.gameProperties.ball.smashSpeed,
          y: param.gameInfo.ballSpeed.y,
        });
        return;
      }
    }
  }

  /* on key down paddle movement with given input */
  updatePaddleActiveState(param: UpdatePaddleActiveStateParams) {
    if (param.player === 'p1') {
      param.gameInfo.pOnePing++;
      Body.setPosition(param.gameInfo.leftPaddle, {
        x: param.gameProperties.leftPaddle.holdPosition.x,
        y: param.gameInfo.leftPaddle.position.y,
      });
    }
    if (param.player === 'p2') {
      param.gameInfo.pTwoPing++;
      Body.setPosition(param.gameInfo.rightPaddle, {
        x: param.gameProperties.rightPaddle.holdPosition.x,
        y: param.gameInfo.rightPaddle.position.y,
      });
    }
    this.checkPerfectTiming(param);
    param.server
      .to(param.roomId)
      .emit('left-paddle-position', param.gameInfo.leftPaddle.position);
    param.server
      .to(param.roomId)
      .emit('right-paddle-position', param.gameInfo.rightPaddle.position);
  }

  /* on key up paddle movement with given input */
  updatePaddlePassiveState(param: UpdatePaddlePassiveStateParams) {
    if (param.player === 'p1') {
      param.gameInfo.pOnePing = 0;
      Body.setPosition(param.gameInfo.leftPaddle, {
        x: param.gameProperties.leftPaddle.position.x,
        y: param.gameInfo.leftPaddle.position.y,
      });
    }
    if (param.player === 'p2') {
      param.gameInfo.pTwoPing = 0;
      Body.setPosition(param.gameInfo.rightPaddle, {
        x: param.gameProperties.rightPaddle.position.x,
        y: param.gameInfo.rightPaddle.position.y,
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
    World.clear(param.gameInfo.engine.world, true);
    Engine.clear(param.gameInfo.engine);
    this.clearRoomIdInFriend(param.gameInfo.pOneId);
    this.clearRoomIdInFriend(param.gameInfo.pTwoId);
    // param.client.leave(param.roomId);
    param.games.delete(param.roomId);
    param.rooms.delete(param.roomId);
    param.server.to(param.roomId).emit('room-closed');
  }

  /* set winner uid, create match-history, end game */
  async handleGameEnd(param: HandleGameStateParams) {
    const endScore = 11;
    if (
      param.gameInfo.pOneScore == endScore ||
      param.gameInfo.pTwoScore == endScore
    ) {
      let winner_uid = 0;
      if (param.gameInfo.pOneScore == endScore)
        winner_uid = param.gameInfo.pOneId;
      else winner_uid = param.gameInfo.pTwoId;

      param.server.to(param.roomId).emit('game-over');
      console.log('Game Over');
      this.gameOver(param);

      await this.matchHistoryService.create({
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
    }
  }

  /* update score */
  updateScore(param: HandleGameStateParams) {
    if (param.gameInfo.ball.position.x < 0 && param.gameInfo.pTwoScore < 11) {
      param.gameInfo.pTwoScore++;
      return 'p2';
    }
    if (
      param.gameInfo.ball.position.x > param.gameProperties.screen.x &&
      param.gameInfo.pOneScore < 11
    ) {
      param.gameInfo.pOneScore++;
      return 'p1';
    }
    return null;
  }

  /* reset ball position if out of bounds */
  resetBallPosition(param: HandleGameStateParams) {
    param.gameInfo.roundWinner = this.updateScore(param);
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
      winner: param.gameInfo.roundWinner,
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

  /* check when ball hits paddle */
  checkBallHit(param: HandleGameStateParams) {
    const leftBallPos =
      param.gameInfo.ball.position.x - param.gameProperties.ball.radius;
    const rightBallPos =
      param.gameInfo.ball.position.x + param.gameProperties.ball.radius;
    const leftPaddlePos =
      param.gameInfo.leftPaddle.position.x +
      param.gameProperties.leftPaddle.width / 2;
    const rightPaddlePos =
      param.gameInfo.leftPaddle.position.x -
      param.gameProperties.leftPaddle.width / 2;
    if (leftBallPos > leftPaddlePos && leftBallPos < leftPaddlePos + 20) {
      console.log('hit left paddle');
      return 1;
    }
    if (rightBallPos > rightPaddlePos && rightBallPos < rightPaddlePos + 20) {
      console.log('hit right paddle');
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
      if (this.checkBallHit(param)) this.playSound();

      if (this.checkBallOutOfBounds(param)) {
        this.resetBallPosition(param);
        this.handleGameEnd(param);
        param.gameInfo.gameStart = 0;
      }
      if (this.checkBallStartPos(param)) {
        clearInterval(startGameInterval);
        param.gameInfo.gameStart = 0;
      }
    }, 15);
  }

  /* generate a number speed for */
  generateSpeed(roundWinner: string) {
    const x = Math.random() * 20;
    const y = 20 - x;

    let result = { x: x, y: y };
    if (x < y) result = { x: y, y: x };
    if (Math.random() < 0.5) result.y *= -1;
    if (roundWinner === 'p2') result.x *= -1;

    return result;
  }

  /* handle game when it starts */
  handleGameState(param: HandleGameStateParams) {
    param.gameInfo.ballSpeed = this.generateSpeed(param.gameInfo.roundWinner);
    Body.setVelocity(param.gameInfo.ball, {
      x: param.gameInfo.ballSpeed.x,
      y: param.gameInfo.ballSpeed.y,
    });
    this.startRound(param);
  }

  async playSound() {
    try {
      await wavPlayer.play({
        path: './public/sounds/hit.wav',
      });
      console.log('The wav file started to be played successfully.');
    } catch (error) {
      console.error('The wav file failed to be played.', error);
    }
  }
}
