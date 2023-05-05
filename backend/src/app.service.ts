import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from "./typeorm/index"


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getSuccesslogin(): string {
    return "successfully login!";
  }

}
