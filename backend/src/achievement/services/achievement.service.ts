import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from 'src/typeorm/achievement.entity';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ){}

  async create(createAchievementDto: CreateAchievementDto) : Promise<Achievement> {
    try {
      const newAchievement = this.achievementRepository.create(createAchievementDto)
      return await this.achievementRepository.save(newAchievement);
    } catch (error) {
      throw new InternalServerErrorException('Could not create achhievement');
    }
  }

  async findAll() : Promise<Achievement[]> {
    return await this.achievementRepository.find();
  }

  async findOne(id: number) : Promise<Achievement> {
    const achievement = await this.achievementRepository.findOneBy({ id });
    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }
    return achievement;
  }

  async update(id: number, updateAchievementDto: UpdateAchievementDto) : Promise<Achievement> {
    const achievement = await this.achievementRepository.findOneBy({ id });
    if (!achievement)
      throw new Error(`Achievement with id ${id} not found`);

    const updateAchievement = {
      ...achievement,
      ...updateAchievementDto,
    }
    return await this.achievementRepository.save(updateAchievement);
  }

  async remove(id: number) : Promise<void> {
    const achievement = await this.findOne(id);
    await await this.achievementRepository.remove(achievement);
  }
}
