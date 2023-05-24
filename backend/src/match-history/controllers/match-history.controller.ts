import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MatchHistoryService } from '../services/match-history.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('match-history')
@ApiTags('Match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Get()
  getHistory() {
    return this.matchHistoryService.getHistory();
  }

  @Get('match')
  getByMatchUid(@Query('uid') uid: string) {
    return this.matchHistoryService.getByMatchUid(+uid);
  }

  @Get('player')
  getByPlayerUid(@Query('uid') uid: string) {
    return this.matchHistoryService.getByPlayerUid(+uid);
  }

  @Get('score')
  getByScore(@Query('score') score: string) {
    return this.matchHistoryService.getByScore(+score);
  }

  @Post()
  create(@Body() createMatchHistoryDto: CreateMatchHistoryDto) {
    return this.matchHistoryService.create(createMatchHistoryDto);
  }

  @Delete('match')
  remove(@Query('uid') uid: string) {
    return this.matchHistoryService.remove(+uid);
  }
}
