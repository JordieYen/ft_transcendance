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
import { UserAchievementService } from 'src/user_achievement/services/user_achievement.service';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,
    private readonly userService: UsersService,
    private readonly statService: StatService,
    private readonly userAchievementService: UserAchievementService,
  ) {}

  // Return All Entries
  async getHistory(): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      relations: {
        p1: true,
        p2: true,
      },
    });
  }

  // Return entries with {match_uid}
  async getByMatchUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      relations: {
        p1: true,
        p2: true,
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
        p1: true,
        p2: true,
      },
      where: [{ p1: { id: uid } }, { p2: { id: uid } }],
    });
  }

  // Return entries with {winner_uid}
  async getWinsByPlayerUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      relations: {
        p1: true,
        p2: true,
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
      if (match.p1.id === uid) {
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
      if (match.p1.id === uid) total += match.p1_score;
      else total += match.p2_score;
    }

    return total;
  }

  // Return lifetime deaths from a player
  async getLifetimeDeathsByPlayerUid(uid: number): Promise<number> {
    const matchHistory = await this.getByPlayerUid(uid);

    let total = 0;
    for (const match of matchHistory) {
      if (match.p1.id === uid) total += match.p2_score;
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
      if (match.p1.id === uid) total += match.p1_smashes;
      else total += match.p2_smashes;
    }

    return total;
  }

  // Update Mmr value by match_uid
  async updateMmr(match: MatchHistory) {
    const p1 = match.p1.id;
    const p2 = match.p2.id;
    match.p1_mmr = await this.getMmrByPlayerUid(p1);
    match.p2_mmr = await this.getMmrByPlayerUid(p2);
    return await this.matchHistoryRepository.save(match);
  }

  // Update stat value by match_uid
  async updateStat(user: User) {
    await this.statService.updateStat(user, {
      wins: await this.getTotalWinsByPlayerUid(user.id),
      losses: await this.getTotalLossByPlayerUid(user.id),
      kills: await this.getLifetimeKillsByPlayerUid(user.id),
      deaths: await this.getLifetimeDeathsByPlayerUid(user.id),
      smashes: await this.getLifetimeSmashesByPlayerUid(user.id),
      win_streak: await this.getLifetimeWinstreakByPlayerUid(user.id),
      current_mmr: await this.getMmrByPlayerUid(user.id),
      best_mmr: await this.getHighestMmrByPlayerUid(user.id),
    });
  }

  // Update stat value by match_uid
  async updateKillChainAchievement(match: MatchHistory) {
    if (match.p1_score === 11 && match.p2_score === 0) {
      if (
        (await this.userAchievementService.checkExists(match.p1.id, 10)) ===
        false
      ) {
        await this.userAchievementService.create({
          user: match.p1.id,
          achievement: 10,
        });
      }
    }
    if (match.p1_score === 0 && match.p2_score === 11) {
      if (
        (await this.userAchievementService.checkExists(match.p2.id, 10)) ===
        false
      ) {
        await this.userAchievementService.create({
          user: match.p2.id,
          achievement: 10,
        });
      }
    }
  }

  // Update user achievement
  async updateUserAchievement(uid: number): Promise<void> {
    const stat = (await this.statService.getByPlayerUid(uid))[0];

    if (stat.smashes >= 10) {
      if ((await this.userAchievementService.checkExists(uid, 2)) === false) {
        await this.userAchievementService.create({
          user: uid,
          achievement: 2,
        });
      }
    }
    let count = 5;
    for (let i = 3; i <= 8; ++i) {
      if (stat.kills >= count) {
        if ((await this.userAchievementService.checkExists(uid, i)) === false) {
          await this.userAchievementService.create({
            user: uid,
            achievement: i,
          });
        }
      }
      count += 5;
    }
    if (stat.kills >= 50) {
      if ((await this.userAchievementService.checkExists(uid, 9)) === false) {
        await this.userAchievementService.create({
          user: uid,
          achievement: 9,
        });
      }
    }
  }

  // Add new entry
  async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    const newMatch = await this.matchHistoryRepository.create({
      winner_uid: createMatchHistoryDto.winner_uid,
      p1: await this.userService.findUsersByIdWithRelation(
        createMatchHistoryDto.p1,
      ),
      p2: await this.userService.findUsersByIdWithRelation(
        createMatchHistoryDto.p2,
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
      await this.updateStat(newMatch.p1);
      await this.updateStat(newMatch.p2);
      await this.updateKillChainAchievement(newMatch);
      await this.updateUserAchievement(newMatch.p1.id);
      await this.updateUserAchievement(newMatch.p2.id);
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
}
