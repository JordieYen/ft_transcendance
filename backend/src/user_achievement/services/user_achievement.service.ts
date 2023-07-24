import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementService } from 'src/achievement/services/achievement.service';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserAchievementService {
  constructor(
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepository: Repository<UserAchievement>,
    private readonly userService: UsersService,
    private readonly achievementService: AchievementService,
  ) {}

  async create(
    createUserAchievementDto: CreateUserAchievementDto,
  ): Promise<UserAchievement> {
    const userAchievement = new UserAchievement();
    userAchievement.user = await this.userService.findUsersByIdWithRelation(
      createUserAchievementDto.user,
    );
    userAchievement.achievement = await this.achievementService.findOne(
      createUserAchievementDto.achievement,
    );
    return await this.userAchievementRepository.save(userAchievement);
  }

  async findAll(): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.find({
      relations: ['user', 'achievement'],
    });
  }

  async findAllByPlayerUid(id: number): Promise<UserAchievement[]> {
    const userAchievements: any[] = await this.userAchievementRepository.find({
      relations: ['user', 'achievement'],
    });
    let userAchievement: any[] = [];
    for (const achievement of userAchievements) {
      console.log('FOR LOOP RUNNING', achievement.user.id, id);
      if (achievement.user.id.toString() === id.toString()) {
        console.log('ture');
        userAchievement.push(achievement);
      }
    }
    console.log('pepela', userAchievement);
    console.log('UID', id);
    return userAchievement;
  }

  async findOne(id: number): Promise<UserAchievement> {
    const userAchievement = await this.userAchievementRepository.findOne({
      relations: ['user', 'achievement'],
      where: {
        id: id,
      },
    });
    if (!userAchievement)
      throw new NotFoundException(`User achievement with ${id} not found. `);
    return userAchievement;
  }

  // Find achievements by player uid
  async findByPlayerUid(uid: number): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.find({
      relations: { user: true, achievement: true },
      where: {
        user: { id: uid },
      },
    });
  }

  // return true if not found in user achievement by player uid
  async checkExists(uid: number, achievement_id: number): Promise<boolean> {
    const achievements = await this.findByPlayerUid(uid);

    for (const ac of achievements) {
      if (ac.achievement.id === achievement_id) {
        return true;
      }
    }
    return false;
  }

  async update(
    id: number,
    updateUserAchievementDto: Partial<UpdateUserAchievementDto>,
  ): Promise<UserAchievement> {
    try {
      let userAchievement = await this.findOne(id);
      if (!userAchievement) {
        throw new Error(`User achievement with id ${id} not found`);
      }

      if (updateUserAchievementDto.user) {
        const user = await this.userService.findUsersById(
          updateUserAchievementDto.user,
        );
        if (!user) {
          throw new Error(
            `User with id ${updateUserAchievementDto.user} not found`,
          );
        }
        userAchievement.user = user;
      }

      if (updateUserAchievementDto.achievement) {
        const achievement = await this.achievementService.findOne(
          updateUserAchievementDto.achievement,
        );
        if (!achievement) {
          throw new Error(
            `Achievement with id ${updateUserAchievementDto.achievement} not found`,
          );
        }
        userAchievement.achievement = achievement;
      }

      userAchievement = await this.userAchievementRepository.save(
        userAchievement,
      );
      return await userAchievement;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update user achievement',
      );
    }
  }

  async remove(id: number) {
    const userAchievemnt = await this.findOne(id);
    if (!userAchievemnt) {
      throw new NotFoundException(`userAchievemnt with ID ${id} not found`);
    }
    return await this.userAchievementRepository.delete(id);
  }
}
