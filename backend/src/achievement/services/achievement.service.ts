import { Injectable } from '@nestjs/common';
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
    const newAchievement = this.achievementRepository.create(createAchievementDto)
    return this.achievementRepository.save(newAchievement);
  }

  async findAll() : Promise<Achievement[]> {
    return this.achievementRepository.find();
  }

  async findOne(id: number) : Promise<Achievement> {
    return this.achievementRepository.findOneBy({ id });
  }

  async update(id: number, updateAchievementDto: UpdateAchievementDto) : Promise<Achievement> {
    const achievement = await this.achievementRepository.findOneBy({ id });
    if (!achievement)
      throw new Error(`Achievement with id ${id} not found`);

    const updateAchievement = {
      ...achievement,
      ...updateAchievementDto,
    }
    return this.achievementRepository.save(updateAchievement);
  }

  async remove(id: number) : Promise<void> {
    const achievement = await this.achievementRepository.findOneBy({ id });
    if (!achievement)
      throw new Error(`Achievement with id ${id} not found`);
    await this.achievementRepository.remove(achievement);
  }
}
