import { Module } from '@nestjs/common';
import { MatchHistoryService } from './services/match-history.service';
import { MatchHistoryController } from './controllers/match-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { StatModule } from 'src/stat/stat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchHistory]),
    StatModule
  ],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService],
  exports: [MatchHistoryService, TypeOrmModule]
})
export class MatchHistoryModule {}
