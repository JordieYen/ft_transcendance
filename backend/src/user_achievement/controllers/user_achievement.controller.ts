import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAchievementService } from '../services/user_achievement.service';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';

@Controller('user-achievement')
export class UserAchievementController {
  constructor(private readonly userAchievementService: UserAchievementService) {}

  @Post()
  async create(@Body() createUserAchievementDto: CreateUserAchievementDto) {
    return this.userAchievementService.create(createUserAchievementDto);
  }

  @Get()
  findAll() {
    return this.userAchievementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAchievementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserAchievementDto: UpdateUserAchievementDto) {
    return this.userAchievementService.update(+id, updateUserAchievementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAchievementService.remove(+id);
  }
}
