import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly configService: ConfigService) {}

  @Get()
  getHello(): string {
    const dbUsername = this.configService.get<string>('DB_USERNAME');
    console.log('DB_USERNAME:', dbUsername);
    return this.appService.getHello();

  }
}
