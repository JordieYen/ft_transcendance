import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { StatService } from 'src/stat/services/stat.service';

@Injectable()
export class MatchHistoryService {
  async deleteAll() {
    try {
      await this.matchHistoryRepository.clear();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete all friend',
        error,
      );
    }
  }
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,
    private readonly userService: UsersService,
    private readonly statService: StatService,
  ) {}

  // Return All Entries
  async getHistory(): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find();
  }

  // Return entries with {match_uid}
  async getByMatchUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      relations: {
        p1_uid: true,
        p2_uid: true,
      },
      where: {
        match_uid: uid,
      },
    });
  }

  // Return entries with {user_uid}
  async getByPlayerUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      relations: {
        p1_uid: true,
        p2_uid: true,
      },
      where: [{ p1_uid: { id: uid } }, { p2_uid: { id: uid } }],
    });
  }

  // Return entries with {winner_uid}
  async getWinsByPlayerUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      relations: {
        p1_uid: true,
        p2_uid: true,
      },
      where: {
        winner_uid: uid,
      },
    });
  }

  // Return entries with {score}
  async getByScore(score: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: [{ p1_score: score }, { p2_score: score }],
    });
  }

  // Return total games played from a player
  async getTotalGamesByPlayerUid(uid: number): Promise<number> {
    const total = (await this.getByPlayerUid(uid)).length;
    return total;
  }

  // Return total wins from a player
  async getTotalWinsByPlayerUid(uid: number): Promise<number> {
    const total = (await this.getWinsByPlayerUid(uid)).length;
    return total;
  }

  // Return total loss by a player
  async getTotalLossByPlayerUid(uid: number): Promise<number> {
    const totalMatches = await this.getTotalGamesByPlayerUid(uid);
    const totalWins = await this.getTotalWinsByPlayerUid(uid);
    const total = totalMatches - totalWins;
    return total;
  }

  // Return MMR of a player
  async getMmrByPlayerUid(uid: number): Promise<number> {
    const totalWins = await this.getTotalWinsByPlayerUid(uid);
    const totalLoss = await this.getTotalLossByPlayerUid(uid);
    const total = 1000 + (totalWins * 10 - totalLoss * 5);
    return total;
  }

  // Return lifetime MMR of a player
  async getHighestMmrByPlayerUid(uid: number): Promise<number> {
    const matchHistory = await this.getByPlayerUid(uid);

    let best = 1000;
    for (const match of matchHistory) {
      if (match.p1_uid.id === uid) {
        if (match.p1_mmr > best) best = match.p1_mmr;
      } else {
        if (match.p2_mmr > best) best = match.p2_mmr;
      }
    }
    return best;
  }

  // Return lifetime winstreak of a player
  async getLifetimeWinstreakByPlayerUid(uid: number): Promise<number> {
    const matchHistory = await this.getByPlayerUid(uid);

    let currentWinstreak = 0;
    let longestWinstreak = 0;
    for (const match of matchHistory) {
      if (match.winner_uid === uid) {
        ++currentWinstreak;
        if (currentWinstreak > longestWinstreak)
          longestWinstreak = currentWinstreak;
      } else currentWinstreak = 0;
    }

    return longestWinstreak;
  }

  // Return lifetime kills of a player
  async getLifetimeKillsByPlayerUid(uid: number): Promise<number> {
    const matchHistory = await this.getByPlayerUid(uid);

    let total = 0;
    for (const match of matchHistory) {
      if (match.p1_uid.id === uid) total += match.p1_score;
      else total += match.p2_score;
    }

    return total;
  }

  // Return lifetime deaths from a player
  async getLifetimeDeathsByPlayerUid(uid: number): Promise<number> {
    const matchHistory = await this.getByPlayerUid(uid);

    let total = 0;
    for (const match of matchHistory) {
      if (match.p1_uid.id === uid) total += match.p2_score;
      else total += match.p1_score;
    }

    return total;
  }

  // Return k/d ratio of a player
  async getKillDeathRatioByPlayerUid(uid: number): Promise<string> {
    const totalKills = await this.getLifetimeKillsByPlayerUid(uid);
    const totalDeaths = await this.getLifetimeDeathsByPlayerUid(uid);
    const total = totalKills / totalDeaths;
    return total.toFixed(2);
  }

  // Return lifetime smashes of a player
  async getLifetimeSmashesByPlayerUid(uid: number): Promise<number> {
    const matchHistory = await this.getByPlayerUid(uid);

    let total = 0;
    for (const match of matchHistory) {
      if (match.p1_uid.id === uid) total += match.p1_smashes;
      else total += match.p2_smashes;
    }

    return total;
  }

  // Update Mmr value by match_uid
  async updateMmr(match: MatchHistory) {
    const p1_uid = match.p1_uid.id;
    const p2_uid = match.p2_uid.id;
    match.p1_mmr = await this.getMmrByPlayerUid(p1_uid);
    match.p2_mmr = await this.getMmrByPlayerUid(p2_uid);
    return await this.matchHistoryRepository.save(match);
  }

  // Update stat value by match_uid
  async updateStat(match: MatchHistory, player: number) {
  const p1_uid = match.p1_uid.id;
    const p2_uid = match.p2_uid.id;
    
    if (player === 1) {
      await this.statService.updateStat(p1_uid, {
        wins: await this.getTotalWinsByPlayerUid(p1_uid),
        losses: await this.getTotalLossByPlayerUid(p1_uid),
        kills: await this.getLifetimeKillsByPlayerUid(p1_uid),
        deaths: await this.getLifetimeDeathsByPlayerUid(p1_uid),
        smashes: await this.getLifetimeSmashesByPlayerUid(p1_uid),
        winstreak: await this.getLifetimeWinstreakByPlayerUid(p1_uid),
        current_mmr: await this.getMmrByPlayerUid(p1_uid),
        best_mmr: await this.getHighestMmrByPlayerUid(p1_uid),
      });
    } else {
      await this.statService.updateStat(p2_uid, {
        wins: await this.getTotalWinsByPlayerUid(p2_uid),
        losses: await this.getTotalLossByPlayerUid(p2_uid),
        kills: await this.getLifetimeKillsByPlayerUid(p2_uid),
        deaths: await this.getLifetimeDeathsByPlayerUid(p2_uid),
        smashes: await this.getLifetimeSmashesByPlayerUid(p2_uid),
        winstreak: await this.getLifetimeWinstreakByPlayerUid(p2_uid),
        current_mmr: await this.getMmrByPlayerUid(p2_uid),
        best_mmr: await this.getHighestMmrByPlayerUid(p2_uid),
      });
    }
  }

  // Add new entry
  async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    const newMatch = await this.matchHistoryRepository.create({
      winner_uid: createMatchHistoryDto.winner_uid,
      p1_uid: await this.userService.findUsersById(
        createMatchHistoryDto.p1_uid,
      ),
      p2_uid: await this.userService.findUsersById(
        createMatchHistoryDto.p2_uid,
      ),
      p1_score: createMatchHistoryDto.p1_score,
      p2_score: createMatchHistoryDto.p2_score,
      p1_smashes: createMatchHistoryDto.p1_smashes,
      p2_smashes: createMatchHistoryDto.p2_smashes,
      p1_mmr: createMatchHistoryDto.p1_mmr,
      p2_mmr: createMatchHistoryDto.p2_mmr,
    });
    console.log(newMatch);
    try {
      await this.matchHistoryRepository.save(newMatch);
      
      await this.updateMmr(newMatch);
      await this.updateStat(newMatch, 1);
      await this.updateStat(newMatch, 2);
    } catch (error) {
      console.log('error=', error.message);
      throw new InternalServerErrorException('Could not create match-history');
    }
  }

  // Delete an entry
  async remove(uid: number) {
    try {
      await this.matchHistoryRepository.delete(uid);
      return { message: 'User with uid ${uid} has been deleted successfully' };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
