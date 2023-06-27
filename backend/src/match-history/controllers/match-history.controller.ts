import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { MatchHistoryService } from '../services/match-history.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { ApiTags } from '@nestjs/swagger';
import { MatchHistory } from 'src/typeorm/match_history.entity';

@Controller('match-history')
@ApiTags('Match-history')
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

  @Get('wins')
  async getWinsByPlayerUid(@Query('uid') uid: string): Promise<MatchHistory[]> {
    return this.matchHistoryService.getWinsByPlayerUid(+uid);
  }

  @Get('score')
  async getByScore(@Query('score') score: string): Promise<MatchHistory[]> {
    return this.matchHistoryService.getByScore(+score);
  }

  @Get('current-mmr')
  async getMmrByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getMmrByPlayerUid(+uid);
  }

  @Post()
  async create(
    @Body() createMatchHistoryDto: CreateMatchHistoryDto,
  ): Promise<void> {
    return this.matchHistoryService.create(createMatchHistoryDto);
  }

  @Delete('match')
  async remove(@Query('uid') uid: string) {
    return await this.matchHistoryService.remove(+uid);
  }
}
