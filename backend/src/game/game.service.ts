import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Engine, Runner, Bodies, Composite, Body } from 'matter-js';
import { Socket, Server } from 'socket.io';
import {
  GameElements,
  LeaveRoomParams,
  UpdatePaddleParams,
  Paddle,
  UserData,
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
  joinRooms(
    server: Server,
    client: Socket,
    rooms: Map<string, UserData[]>,
    user: UserData,
  ) {
    let { roomId, roomPlayers } = this.findAvailableRoom(rooms);

    // check if user is already in a room
    for (const [existingRoomId, existingRoomPlayers] of rooms) {
      if (existingRoomPlayers.includes(user)) {
        console.log('User is already in a room', user.username, existingRoomId);
        roomId = existingRoomId;
        client.emit('in-room', roomId);
        console.log('User is already in a room');
        return;
      }
    }

    // create a room and place player in room
    if (!roomId && !roomPlayers) {
      roomId = this.generateRoomId(rooms);
      roomPlayers = [user];
      rooms.set(roomId, roomPlayers);
    } else roomPlayers.push(user);
    client.join(roomId);
    client.emit('joined-room', roomId);

    // start game if room has 2 players
    if (roomPlayers.length === 2) {
      const playersData = roomPlayers.map((player) => ({
        player: player,
      }));
      server
        .to(roomId)
        .emit('loading-screen', { roomId, players: playersData });
    }
    this.logRooms(rooms);
  }

  /* check if player exists in room, if one player exist, send opponent-disconnected */
  leaveRoom(leaveRoomParams: LeaveRoomParams) {
    console.log('Game over', leaveRoomParams.roomId);
    const roomPlayers = leaveRoomParams.rooms.get(leaveRoomParams.roomId);
    if (roomPlayers) {
      console.log('Room players: ', roomPlayers);
      const remainingPlayer = roomPlayers.find(
        (player) => player !== leaveRoomParams.user,
      );
      console.log('Remaining player: ', remainingPlayer);

      if (remainingPlayer) {
        leaveRoomParams.server
          .to(leaveRoomParams.roomId)
          .emit('opponent-disconnected');
      }
      const updatedRoomPlayers = roomPlayers.filter(
        (player) => player !== leaveRoomParams.user,
      );
      leaveRoomParams.rooms.set(leaveRoomParams.roomId, updatedRoomPlayers);

      // if room is empty, delete room and emit room-closed
      if (updatedRoomPlayers.length === 0) {
        leaveRoomParams.rooms.delete(leaveRoomParams.roomId);
        leaveRoomParams.server.to(leaveRoomParams.roomId).emit('room-closed');
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

  /* update paddle movement with given input */
  updatePaddlePos(updatePaddleParam: UpdatePaddleParams) {
    if (updatePaddleParam.player === 'p1') {
      Body.setPosition(updatePaddleParam.leftPaddle, {
        x: updatePaddleParam.gameProperties.leftPaddle.position.x,
        y: updatePaddleParam.mouseY,
      });
    }
    if (updatePaddleParam.player === 'p2') {
      Body.setPosition(updatePaddleParam.rightPaddle, {
        x: updatePaddleParam.gameProperties.rightPaddle.position.x,
        y: updatePaddleParam.mouseY,
      });
    }
    updatePaddleParam.server
      .to(updatePaddleParam.room)
      .emit('left-paddle-position', updatePaddleParam.leftPaddle.position);
    updatePaddleParam.server
      .to(updatePaddleParam.room)
      .emit('right-paddle-position', updatePaddleParam.rightPaddle.position);
  }
}
