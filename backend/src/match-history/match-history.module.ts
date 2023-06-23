import { Module } from '@nestjs/common';
import { MatchHistoryService } from './services/match-history.service';
import { MatchHistoryController } from './controllers/match-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { UsersModule } from 'src/users/users.module';
import { StatModule } from 'src/stat/stat.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistory]), UsersModule, StatModule],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService],
  exports: [MatchHistoryService, TypeOrmModule],
})
export class MatchHistoryModule {}
