import { Socket, Server } from 'socket.io';
import { Body, Vector } from 'matter-js';
import { Stat } from 'src/typeorm/stats.entity';

export interface Ball {
  position: Vector;
  radius: number;
  speed: Vector;
  maxTimeFrame: number;
  perfectHitZone: number;
  perfectHitDuration: number;
}

export interface Paddle {
  width: number;
  height: number;
  position: Vector;
}

export interface GameElements {
  screen: Vector;
  border: Vector;
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
}

export interface UserData {
  avatar: string;
  id: number | null;
  intra_uid: string;
  username: string;
  online: boolean;
  authentication: boolean;
  authenticationString: string;
  p1_match: string;
  stat: Stat;
  userAchievement: string;
  firstTimeLogin: boolean;
  socketId: string;
}

/* game_gateway.ts Params */

export interface MovePaddleParams {
  room: string;
  player: string;
  mouseY: number;
  gameProperties: GameElements;
}

export interface StartGameParams {
  room: string;
  gameProperties: GameElements;
}

/* game_service.ts Params */

export interface JoinRoomParams {
  server: Server;
  client: Socket;
  rooms: Map<string, UserData[]>;
  user: UserData;
}

export interface LeaveRoomParams {
  server: Server;
  roomId: string;
  rooms: Map<string, UserData[]>;
  user: UserData;
}

export interface UpdatePaddleParams {
  server: Server;
  room: string;
  player: string;
  mouseY: number;
  leftPaddle: Body;
  rightPaddle: Body;
  gameProperties: GameElements;
}

export interface HandleGameStateParams {
  server: Server;
  room: string;
  ball: Body;
  gameProperties: GameElements;
}
