import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';
import { AchievementService } from '../services/achievement.service';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async reate(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementService.create(createAchievementDto);
  }

  @Get()
  async findAll() {
    return this.achievementService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.achievementService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAchievementDto: UpdateAchievementDto) {
    return this.achievementService.update(id, updateAchievementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.achievementService.remove(id);
  }
}
