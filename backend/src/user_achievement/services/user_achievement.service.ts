import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementService } from 'src/achievement/services/achievement.service';
import { Achievement } from 'src/typeorm/achievement.entity';
import { User } from 'src/typeorm/user.entity';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';
import { UsersService } from 'src/users/services/users.service';
import { getRepository, Repository } from 'typeorm';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';

@Injectable()
export class UserAchievementService {
  constructor(
    @InjectRepository(UserAchievement)
      private userAchievementRepository: Repository<UserAchievement>, 
      private readonly userService: UsersService, 
      private readonly achievementService: AchievementService, 
  ){}

  async create(createUserAchievementDto: CreateUserAchievementDto) : Promise<UserAchievement> {
    const { userId, achievementId } = createUserAchievementDto;

    const existingRecord = await this.userAchievementRepository.findOne({
      where: {
        user: { id: userId },
        achievement: { id: achievementId },
      },
    });

    if (existingRecord) {
      throw new ConflictException('User achievement record already exists');
    }
    const [ user, achievement ] = await Promise.all([
      this.userService.findUsersById(userId),
      this.achievementService.findOne(achievementId),
    ])
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    if (!achievement) {
      throw new Error(`Achievement with id ${achievementId} not found`);
    }
    const userAchievement = new UserAchievement();
    userAchievement.user = user;
    userAchievement.achievement = achievement;
    return await this.userAchievementRepository.save(userAchievement);
  }

  async findAll() : Promise<UserAchievement[]> {
    return await this.userAchievementRepository.find({
      relations: [
          'user',
          'achievement',
      ]
    });
  }

  async findOne(id: number) : Promise<UserAchievement> {
    const userAchievement =  await this.userAchievementRepository.findOne({
      relations: ['user', 'achievement'],
      where: {
        id: id,
      }
    });
    if (!userAchievement)
      throw new NotFoundException(`User achievement with ${id} not found. `);
    return userAchievement;
  }
  
  async update(id: number, updateUserAchievementDto: Partial<UpdateUserAchievementDto>): Promise<UserAchievement> {
    try {
      let userAchievement = await this.findOne(id);
      if (!userAchievement) {
        throw new Error(`User achievement with id ${id} not found`);
      }

      if (updateUserAchievementDto.userId) {
        const user = await this.userService.findUsersById(updateUserAchievementDto.userId);
        if (!user) {
          throw new Error(`User with id ${updateUserAchievementDto.userId} not found`);
        }
        userAchievement.user = user;
      }
      
      if (updateUserAchievementDto.achievementId) {
        const achievement = await this.achievementService.findOne(updateUserAchievementDto.achievementId);
        if (!achievement) {
          throw new Error(`Achievement with id ${updateUserAchievementDto.achievementId} not found`);
        }
        userAchievement.achievement = achievement;
      }
      
      userAchievement = await this.userAchievementRepository.save(userAchievement);
      return await userAchievement;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user achievement');
    }
  }
  

  async remove(id: number) {
    const userAchievemnt = await this.findOne(id);
    if (!userAchievemnt)
      throw new NotFoundException(`userAchievemnt with ID ${id} not found`);
    return await this.userAchievementRepository.delete(id);
  }
}
