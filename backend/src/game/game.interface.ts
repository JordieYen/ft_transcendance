import { Socket, Server } from 'socket.io';
import { Body, Engine, Vector } from 'matter-js';
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

export interface GameInfo {
  engine: Engine;
  leftPaddle: Body;
  rightPaddle: Body;
  ball: Body;
  pOneId: number;
  pTwoId: number;
  gameStart: number;
  pOneScore: number;
  pTwoScore: number;
  pOneSmash: number;
  pTwoSmash: number;
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

export interface InitializeGameParam {
  roomId: string;
  pOneId: number;
  pTwoId: number;
  gameProperties: GameElements;
}

export interface MovePaddleParams {
  roomId: string;
  player: string;
  mouseY: number;
  gameProperties: GameElements;
}

export interface StartGameParams {
  roomId: string;
  gameProperties: GameElements;
}

export interface EndGameParams {
  roomId: string;
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
  roomArray: Map<string, UserData[]>;
  gameArray: Map<string, GameInfo>;
  gameInfo: GameInfo;
  user: UserData;
}

export interface UpdatePaddleParams {
  server: Server;
  roomId: string;
  player: string;
  mouseY: number;
  gameInfo: GameInfo;
  gameProperties: GameElements;
}

export interface HandleGameStateParams {
  server: Server;
  roomId: string;
  roomArray: Map<string, UserData[]>;
  gameArray: Map<string, GameInfo>;
  gameInfo: GameInfo;
  gameProperties: GameElements;
}
