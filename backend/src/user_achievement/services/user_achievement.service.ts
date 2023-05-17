import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from 'src/typeorm/achievement.entity';
import { User } from 'src/typeorm/user.entity';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';
import { Repository } from 'typeorm';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';

@Injectable()
export class UserAchievementService {
  constructor(
    @InjectRepository(UserAchievement)
      private userAchievementRepository: Repository<UserAchievement>, 
    @InjectRepository(User)
      private userRepository: Repository<User>, 
    @InjectRepository(Achievement)
      private achievementRepository: Repository<Achievement>, 
  ){}

  // async create(createUserAchievementDto: CreateUserAchievementDto) : Promise<UserAchievement> {
  async create(createUserAchievementDto: CreateUserAchievementDto) : Promise<UserAchievement> {
    const { userId, achievementId } = createUserAchievementDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    const achievement = await this.achievementRepository.findOneBy({ id: achievementId });
    if (!achievement) {
      throw new Error(`Achievement with id ${achievementId} not found`);
    }
    const userAchievement = new UserAchievement();
    userAchievement.user = user;
    userAchievement.achievement = achievement;
    return this.userAchievementRepository.save(userAchievement);
  }

  async findAll() : Promise<UserAchievement[]> {
    return this.userAchievementRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} userAchievement`;
  }

  update(id: number, updateUserAchievementDto: UpdateUserAchievementDto) {
    return `This action updates a #${id} userAchievement`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAchievement`;
  }
}
