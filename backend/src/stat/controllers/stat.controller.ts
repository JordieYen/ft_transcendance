import { Controller, Get, Delete, Query } from '@nestjs/common';
import { StatService } from '../services/stat.service';
import { ApiTags } from '@nestjs/swagger';
import { Stat } from 'src/typeorm/stats.entity';

@Controller('stat')
@ApiTags('Stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get()
  async getStat(): Promise<Stat[]> {
    return await this.statService.getStat();
  }

  @Get('player')
  async getByPlayerUid(@Query('uid') uid: string): Promise<Stat[]> {
    return this.statService.getByPlayerUid(+uid);
  }

  @Get('games')
  async getTotalGamesByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.statService.getTotalGamesByPlayerUid(+uid);
  }

  @Get('wins')
  async getTotalWinsByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.statService.getTotalWinsByPlayerUid(+uid);
  }

  @Get('loss')
  async getTotalLossByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.statService.getTotalLossByPlayerUid(+uid);
  }

  @Get('kills')
  async getLifetimeKillsByPlayerUid(
    @Query('uid') uid: string,
  ): Promise<number> {
    return this.statService.getLifetimeKillsByPlayerUid(+uid);
  }

  @Get('deaths')
  async getLifetimeDeathsByPlayerUid(
    @Query('uid') uid: string,
  ): Promise<number> {
    return this.statService.getLifetimeDeathsByPlayerUid(+uid);
  }

  @Get('kdr')
  async getKillDeathRatioByPlayerUid(
    @Query('uid') uid: string,
  ): Promise<string> {
    return this.statService.getKillDeathRatioByPlayerUid(+uid);
  }

  @Get('smashes')
  async getLifetimeSmashesByPlayerUid(
    @Query('uid') uid: string,
  ): Promise<number> {
    return this.statService.getLifetimeSmashesByPlayerUid(+uid);
  }

  @Get('win-streak')
  async getLifetimeWinstreakByPlayerUid(
    @Query('uid') uid: string,
  ): Promise<number> {
    return this.statService.getLifetimeWinstreakByPlayerUid(+uid);
  }

  @Get('current-mmr')
  async getMmrByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.statService.getMmrByPlayerUid(+uid);
  }

  @Get('top-mmr')
  async getHighestMmrByPlayerUid(@Query('uid') uid: string): Promise<number> {
    return this.statService.getHighestMmrByPlayerUid(+uid);
  }

  // @Post('player')
  // async create(
  //   @Query('uid') uid: string,
  //   @Body() createStatDto: CreateStatDto,
  // ): Promise<void> {
  //   const user = await this.userService.findUsersById(+uid);
  //   return await this.statService.create(user, createStatDto);
  // }

  @Delete('player')
  async remove(@Query('uid') uid: string) {
    return await this.statService.remove(+uid);
  }
}
