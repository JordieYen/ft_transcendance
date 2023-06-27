import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from 'src/typeorm/stats.entity';
import { Repository } from 'typeorm';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>,
  ) {}

  // Return All Entries
  async getStat(): Promise<Stat[]> {
    return await this.statRepository.find();
  }

  // Return entries with {uid}
  async getByPlayerUid(uid: number): Promise<Stat[]> {
    return await this.statRepository.find({
      relations: {
        user:  true,
      },
      where: {
        uid: uid,
      },
    });
  }

  // Return total games by player
  async getTotalGamesByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    const total = stat[0].wins + stat[0].losses;
    return total;
  }

  // Return total wins by player
  async getTotalWinsByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].wins;
  }

  // Return total losses by player
  async getTotalLossByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].losses;
  }

  // Return total kills by player
  async getLifetimeKillsByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].kills;
  }

  // Return total deaths by player
  async getLifetimeDeathsByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].deaths;
  }

  // Return k/d ratio of a player
  async getKillDeathRatioByPlayerUid(uid: number): Promise<string> {
    const stat = await this.getByPlayerUid(uid);
    const total = stat[0].kills / stat[0].deaths;
    return total.toFixed(2);
  }

  // Return total smashes by player
  async getLifetimeSmashesByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].smashes;
  }

  // Return lifetime winstreak of a player
  async getLifetimeWinstreakByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].winstreak;
  }

  // Return MMR of a player
  async getMmrByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].current_mmr;
  }

  // Return MMR of a player
  async getHighestMmrByPlayerUid(uid: number): Promise<number> {
    const stat = await this.getByPlayerUid(uid);
    return stat[0].best_mmr;
  }

  // Update existing Stat
  async updateStat(uid: number, updateStatDto: UpdateStatDto) {
    const stat = await this.getByPlayerUid(uid);
    if (updateStatDto?.wins) stat[0].wins = updateStatDto?.wins;
    if (updateStatDto?.losses) stat[0].losses = updateStatDto?.losses;
    if (updateStatDto?.kills) stat[0].kills = updateStatDto?.kills;
    if (updateStatDto?.deaths) stat[0].deaths = updateStatDto?.deaths;
    if (updateStatDto?.smashes) stat[0].smashes = updateStatDto?.smashes;
    if (updateStatDto?.winstreak) stat[0].winstreak = updateStatDto?.winstreak;
    if (updateStatDto?.current_mmr)
      stat[0].current_mmr = updateStatDto?.current_mmr;
    if (updateStatDto?.best_mmr) stat[0].best_mmr = updateStatDto?.best_mmr;
    return await this.statRepository.save(stat);
  }

  // Add new entry
  async create(uid: number, createStatDto: CreateStatDto) {
    const newStat = await this.statRepository.create({
      uid: uid,
      wins: createStatDto.wins,
      losses: createStatDto.losses,
      kills: createStatDto.kills,
      deaths: createStatDto.deaths,
      smashes: createStatDto.smashes,
      winstreak: createStatDto.winstreak,
      current_mmr: createStatDto.current_mmr,
      best_mmr: createStatDto.best_mmr,
    });
    console.log(newStat);
    try {
      await this.statRepository.save(newStat);
    } catch (error) {
      console.log('error=', error.message);
      throw new InternalServerErrorException('Could not create new stat');
    }
  }

  // Delete an entry
  async remove(uid: number) {
    try {
      await this.statRepository.delete(uid);
      return { message: 'Stat with uid ${uid} has been deleted successfully' };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
