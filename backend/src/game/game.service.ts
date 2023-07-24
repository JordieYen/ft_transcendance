import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Engine, Runner, Bodies, Composite, Body } from 'matter-js';
import {
  GameElements,
  LeaveRoomParams,
  UpdatePaddleParams,
  Paddle,
  UserData,
  HandleGameStateParams,
  JoinRoomParams,
  InitializeGameParam,
} from './game.interface';

@Injectable()
export class GameService {
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

  /* join a user into a room */
  joinRooms(param: JoinRoomParams) {
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
        console.log('User is already in a room');
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

  /* check if player exists in room, if one player exist, send opponent-disconnected */
  leaveRoom(param: LeaveRoomParams) {
    console.log('Game over', param.roomId);
    const roomPlayers = param.rooms.get(param.roomId);
    if (roomPlayers) {
      console.log('Room players: ', roomPlayers);
      const remainingPlayer = roomPlayers.find(
        (player) => player !== param.user,
      );
      console.log('Remaining player: ', remainingPlayer);

      if (remainingPlayer) {
        param.server.to(param.roomId).emit('opponent-disconnected');
      }
      const updatedRoomPlayers = roomPlayers.filter(
        (player) => player !== param.user,
      );
      param.rooms.set(param.roomId, updatedRoomPlayers);

      // if room is empty, delete room and emit room-closed
      if (updatedRoomPlayers.length === 0) {
        param.rooms.delete(param.roomId);
        param.gameInfo.delete(param.roomId);
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

    console.log('Game engine started');
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
    console.log('added borders into engine');
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

    console.log('added paddle into engine');
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

    console.log('added ball into engine');
    return ball;
  }

  /* initilizes Game */
  initializeGame(param: InitializeGameParam) {
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
    return {
      engine,
      leftPaddle,
      rightPaddle,
      ball,
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

  /* handle game when it starts */
  handleGameState(param: HandleGameStateParams) {
    param.server
      .to(param.roomId)
      .emit('ball-speed', param.gameProperties.ball.speed);
    Body.setVelocity(param.gameInfo.ball, {
      x: param.gameProperties.ball.speed.x,
      y: param.gameProperties.ball.speed.y,
    });
    const tempInterval = setInterval(() => {
      param.server
        .to(param.roomId)
        .emit('ball-position', param.gameInfo.ball.position);
      if (
        param.gameInfo.ball.position.x < -50 ||
        param.gameInfo.ball.position.x > param.gameProperties.screen.x + 50
      ) {
        if (param.gameInfo.ball.position.x < 0 && param.gameInfo.pTwoScore < 11)
          param.gameInfo.pTwoScore++;
        if (
          param.gameInfo.ball.position.x > param.gameProperties.screen.x &&
          param.gameInfo.pOneScore < 11
        )
          param.gameInfo.pOneScore++;
        Body.setPosition(param.gameInfo.ball, {
          x: param.gameProperties.screen.x / 2,
          y: param.gameProperties.screen.y / 2,
        });
        Body.setVelocity(param.gameInfo.ball, {
          x: 0,
          y: 0,
        });
        param.server.to(param.roomId).emit('ball-position', {
          x: param.gameProperties.screen.x / 2,
          y: param.gameProperties.screen.y / 2,
        });
        param.server.to(param.roomId).emit('ball-speed', { x: 0, y: 0 });
        param.server.to(param.roomId).emit('update-score', {
          pOneScore: param.gameInfo.pOneScore,
          pTwoScore: param.gameInfo.pTwoScore,
        });
        clearInterval(tempInterval);
        if (param.gameInfo.pOneScore == 11 || param.gameInfo.pTwoScore == 11) {
          // end Game and create matchHistory
          console.log('game over');
          Engine.clear(param.gameInfo.engine);
          param.server.to(param.roomId).emit('game-over');
          return;
        }
      }
    }, 15);
  }
}
