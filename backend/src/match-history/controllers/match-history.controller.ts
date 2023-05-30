import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { MatchHistoryService } from '../services/match-history.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { MatchHistory } from 'src/typeorm/match_history.entity';

@Controller('match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Get()
  async getHistory(): Promise<MatchHistory[]> {
    return this.matchHistoryService.getHistory();
  }

  @Get('match')
  async getByMatchUid(@Query('uid') uid: string): Promise<MatchHistory[]> {
    return this.matchHistoryService.getByMatchUid(+uid);
  }

  @Get('player')
  async getByPlayerUid(@Query('uid') uid: string): Promise<MatchHistory[]> {
    return this.matchHistoryService.getByPlayerUid(+uid);
  }

  @Get('score')
  async getByScore(@Query('score') score: string): Promise<MatchHistory[]> {
    return this.matchHistoryService.getByScore(+score);
  }

  @Get('games')
  async getTotalGamesByPlayerUid(@Query('uid') uid: string) {
    return this.matchHistoryService.getTotalGamesByPlayerUid(+uid);
  }

  @Post()
  async create(@Body() createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    return this.matchHistoryService.create(createMatchHistoryDto);
  }

  @Delete('match')
  async remove(@Query('uid') uid: string) {
    return await this.matchHistoryService.remove(+uid);
  }
}
