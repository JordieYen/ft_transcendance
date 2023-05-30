import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Get,
  Req
} from '@nestjs/common';
import { UserSettingsService } from '../services/user-settings.service';
import { AuthService } from 'src/auth/services/auth.service';

@Controller('user-settings')
export class UserSettingsController {
  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly authService: AuthService,
    ) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const userId = await this.authService.verifyToken(token);
    }
  }

  @Put('username')
  updateUsername(@Param('id') username: string, @Body('username') newUsername: string) {
    return this.userSettingsService.updateUsername(username, newUsername);
  }
}
