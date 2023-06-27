import { Module } from '@nestjs/common';
import { UserAchievementService } from './services/user_achievement.service';
import { UserAchievementController } from './controllers/user_achievement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';
import { UsersModule } from 'src/users/users.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAchievement]),
    UsersModule,
    AchievementModule,
  ],
  controllers: [UserAchievementController],
  providers: [UserAchievementService],
  exports: [UserAchievementService, TypeOrmModule],
})
export class UserAchievementModule {}
