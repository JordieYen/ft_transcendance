import { Module } from '@nestjs/common';
import { MatchHistoryService } from './services/match-history.service';
import { MatchHistoryController } from './controllers/match-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/typeorm/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistory, User])],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService, UsersService]
})
export class MatchHistoryModule {}
