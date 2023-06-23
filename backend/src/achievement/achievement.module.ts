import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from 'src/typeorm/achievement.entity';
import { AchievementController } from './controllers/achievement.controller';
import { AchievementService } from './services/achievement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService, TypeOrmModule],
})
export class AchievementModule {}
