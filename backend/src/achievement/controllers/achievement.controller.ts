import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';
import { AchievementService } from '../services/achievement.service';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async create(@Body() createAchievementDto: CreateAchievementDto) {
    return await this.achievementService.create(createAchievementDto);
  }

  @Get()
  async findAll() {
    return await this.achievementService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.achievementService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAchievementDto: UpdateAchievementDto) {
    return await this.achievementService.update(id, updateAchievementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.achievementService.remove(id);
    return await `User achievement with id ${id} has been deleted.`;
  }
}
