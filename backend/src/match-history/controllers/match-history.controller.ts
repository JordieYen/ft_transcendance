import { Controller, Get, Post, Body, Delete, Query, Patch, Param } from '@nestjs/common';
import { MatchHistoryService } from '../services/match-history.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { ApiTags } from '@nestjs/swagger';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { UpdateMatchHistoryDto } from '../dto/update-match-history.dto';

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

  @Get('score')
  async getByScore(@Query('score') score: string): Promise<MatchHistory[]> {
    return this.matchHistoryService.getByScore(+score);
  }

  @Get('games')
  async getTotalGamesByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getTotalGamesByPlayerUid(+uid);
  }

  @Get('wins')
  async getTotalWinsByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getTotalWinsByPlayerUid(+uid);
  }

  @Get('loss')
  async getTotalLossByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getTotalLossByPlayerUid(+uid);
  }

  @Get('current-mmr')
  async getMmrByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getMmrByPlayerUid(+uid);
  }

  @Get('top-mmr')
  async getHighestMmrByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getHighestMmrByPlayerUid(+uid);
  }

  @Get('winstreak')
  async getLifetimeWinstreakByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getLifetimeWinstreakByPlayerUid(+uid);
  }

  @Get('kills')
  async getLifetimeKillsByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getLifetimeKillsByPlayerUid(+uid);
  }

  @Get('deaths')
  async getLifetimeDeathsByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getLifetimeDeathsByPlayerUid(+uid);
  }

  @Get('kdr')
  async getKillDeathRatioByPlayerUid(@Query('uid') uid: string): Promise<string> {
    return this.matchHistoryService.getKillDeathRatioByPlayerUid(+uid);
  }

  @Get('smashes')
  async getLifetimeSmashesByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.matchHistoryService.getLifetimeSmashesByPlayerUid(+uid);
  }

  @Post()
  async create(@Body() createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    return this.matchHistoryService.create(createMatchHistoryDto);
  }

  // @Patch('match')
  // update(@Query('uid') uid: string, @Body() UpdateMatchHistoryDto: UpdateMatchHistoryDto) {
  //   return this.matchHistoryService.updateMmr(+uid, UpdateMatchHistoryDto);
  // }

  @Delete('match')
  async remove(@Query('uid') uid: string) {
    return await this.matchHistoryService.remove(+uid);
  }
}
