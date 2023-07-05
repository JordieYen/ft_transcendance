import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  logic() {
    console.log('game');
  }
}
