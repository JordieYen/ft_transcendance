import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserAchievementService } from '../services/user_achievement.service';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user-achievement')
@ApiTags('User-achievement')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
  ) {}

  @Post('create')
  async create(@Body() createUserAchievementDto: CreateUserAchievementDto) {
    return await this.userAchievementService.create(createUserAchievementDto);
  }

  @Get()
  async findAll() {
    return await this.userAchievementService.findAll();
  }

  @Get('player')
  async findAllByOne(@Query('id') id: number) {
    return await this.userAchievementService.findAllByPlayerUid(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.userAchievementService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserAchievementDto: Partial<UpdateUserAchievementDto>,
  ) {
    return await this.userAchievementService.update(
      id,
      updateUserAchievementDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.userAchievementService.remove(id);
    return { message: ` User achievement with ${id} was deleted.` };
  }
}
