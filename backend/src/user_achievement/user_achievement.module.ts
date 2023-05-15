import { Module } from '@nestjs/common';
import { UserAchievementService } from './services/user_achievement.service';
import { UserAchievementController } from './controllers/user_achievement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { Achievement } from 'src/typeorm/achievement.entity';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Achievement,
      UserAchievement
    ])
  ],
  controllers: [UserAchievementController],
  providers: [UserAchievementService]
})
export class UserAchievementModule {}
