import { Module } from '@nestjs/common';
import { StatService } from './services/stat.service';
import { StatController } from './controllers/stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from 'src/typeorm/stats.entity';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/typeorm/user.entity';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { MatchHistoryService } from 'src/match-history/services/match-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stat, User]),
  ],
  controllers: [StatController],
  providers: [StatService, UsersService]
})
export class StatModule {}
