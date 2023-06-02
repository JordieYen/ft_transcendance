import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistoryService } from 'src/match-history/services/match-history.service';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { Stat } from 'src/typeorm/stats.entity';
import { User } from 'src/typeorm/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat) private statRepository: Repository<Stat>,
    private readonly userService: UsersService,
    private readonly matchHistoryService: MatchHistoryService,
  ) {}

  // async create(createStatDto: CreateStatDto) {
  //   const user = await this.userService.findUsersById(createStatDto.userId);
  //   const newStat = new Stat();
  //   newStat.user = user;
  //   newStat.wins = createStatDto.wins;
  //   newStat.losses = createStatDto.losses;
  //   newStat.mmr = createStatDto.mmr;
  //   const stat = await this.statRepository.create(newStat);
  //   try {
  //     return await this.statRepository.save(stat);
  //   } catch (error) {
  //     throw new InternalServerErrorException('Could not create new stat');
  //   }
  // }

  async create(createStatDto: CreateStatDto) {
    // const user = await this.userService.findUsersByIdWithRelation(createStatDto.userId);
    // console.log(user);
    // const matchHistory = [ ...user?.p1_match, ...user?.p2_match];
    const matchHistory = await this.matchHistoryService.getByPlayerUid(createStatDto.userId)
    const newStat = new Stat();
    // newStat.user = user;
    newStat.userId = createStatDto.userId;
    newStat.total_games = matchHistory.length;
    newStat.wins = matchHistory.filter((match) => match.winner_uid === createStatDto.userId).length;
    newStat.losses = newStat.total_games - newStat.wins;
    newStat.winStreak = this.calculateWinStreak(matchHistory, createStatDto.userId);
    newStat.mmr = this.calculateMMR(newStat.wins, newStat.losses);
    const stat = await this.statRepository.create(newStat);
    try {
      await this.statRepository.save(stat);
      return stat;
    } catch (error) {
      throw new InternalServerErrorException('Could not create new stat');
    }
  }


  calculateWinStreak(matchHistory: MatchHistory[], userId: number): number {
    let currentStreak = 0;
    let longestStreak = 0;

    for (const match of matchHistory) {
      if (match.winner_uid === userId) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
    return longestStreak;
  }

  calculateMMR(wins: number, losses: number) : number {
    return (wins * 10) - (losses * 10);
  }


  async findAll() : Promise<Stat[]> {
    const stat =  await this.statRepository.find({
      relations: [ 'user' ]
    });
    return stat;
  }

  async findOne(id: number) {
    const stat = await this.statRepository.findOne({
      relations: [ 'user'],
      where: {
        id: id,
      }
    })
    if (!stat)
      throw new NotFoundException(`Stat with ${id} is not found`);
    return stat;
  }

  async update(id: number, updateStatDto: UpdateStatDto) {
    const stat = await this.findOne(id);
    if (updateStatDto?.userId) {
      // const user = await this.userService.findUsersById(updateStatDto.userId);
      stat.userId = updateStatDto?.userId;
    }
    stat.wins = updateStatDto?.wins;
    stat.losses = updateStatDto?.losses;
    stat.mmr = updateStatDto?.mmr;
    return await this.statRepository.save(stat);
  }

  async remove(id: number) {
    return await this.statRepository.delete(id);
  }
}
