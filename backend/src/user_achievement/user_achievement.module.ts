import { Module } from '@nestjs/common';
import { UserAchievementService } from './services/user_achievement.service';
import { UserAchievementController } from './controllers/user_achievement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { Achievement } from 'src/typeorm/achievement.entity';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';
import { UsersService } from 'src/users/services/users.service';
import { AchievementService } from 'src/achievement/services/achievement.service';
import { UsersModule } from 'src/users/users.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAchievement]),
    UsersModule,
    AchievementModule
  ],
  controllers: [UserAchievementController],
  providers: [
    UserAchievementService,
  ],
  exports: [
    UserAchievementService,
    TypeOrmModule,
  ]
})
export class UserAchievementModule {}
