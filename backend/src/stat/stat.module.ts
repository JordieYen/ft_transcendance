import { Module } from '@nestjs/common';
import { StatService } from './services/stat.service';
import { StatController } from './controllers/stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from 'src/typeorm/stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stat])
  ],
  controllers: [StatController],
  providers: [StatService],
  exports: [StatService, TypeOrmModule],
})
export class StatModule {}
