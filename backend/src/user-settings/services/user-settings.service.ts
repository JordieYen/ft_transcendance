import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service'

@Injectable()
export class UserSettingsService {
  constructor(private readonly usersService: UsersService) {}
  updateUsername(username: string, newUsername: string) {
    const user = await this.usersService.findUsersById(this.);

    if (!user)
      throw new NotFoundException('User not found');
    if (user.username)
  }
}
