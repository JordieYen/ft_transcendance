import { Module } from '@nestjs/common';
import { StatService } from './services/stat.service';
import { StatController } from './controllers/stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from 'src/typeorm/stats.entity';
import { MatchHistoryModule } from 'src/match-history/match-history.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stat]),
    MatchHistoryModule,
    UsersModule
  ],
  controllers: [StatController],
  providers: [StatService],
  exports: [StatService, TypeOrmModule],
})
export class StatModule {}
